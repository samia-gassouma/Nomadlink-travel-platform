package tn.cloudcrafters.picloud.Controller.gestionPack;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

import com.google.gson.JsonSyntaxException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.model.checkout.SessionCollection;
import com.stripe.net.ApiResource;
import com.stripe.param.CouponCreateParams;
import com.stripe.param.CustomerListParams;
import com.stripe.param.PromotionCodeCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionListParams;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.Facture;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;
import tn.cloudcrafters.picloud.Entity.gestionPack.Paiement;
import tn.cloudcrafters.picloud.Entity.gestionPack.RewardPoints;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Service.*;
import tn.cloudcrafters.picloud.Service.gestionPack.FactureService;
import tn.cloudcrafters.picloud.Service.gestionPack.PackService;
import tn.cloudcrafters.picloud.Service.gestionPack.PaiementService;
import tn.cloudcrafters.picloud.Service.gestionPack.RewardPointsService;
import tn.cloudcrafters.picloud.Service.gestionUser.UserService;
import tn.cloudcrafters.picloud.Service.gestionboutique.produit.ProduitService;

@RestController
public class StripeServerController {
    @Autowired
    private PaiementService paiementService;

    @Autowired
    private UserService userService;

    @Autowired
    private PackService packService;

    @Autowired
    private RewardPointsService rewardPointsService;

    @Autowired
    private FactureService factureService;
 @Autowired
    private EmailServicepaiment emailService;
 @Autowired
    private ProduitService produitService;



    Paiement paiement = new Paiement();

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @PostConstruct
    public void setup() {
        Stripe.apiKey = stripeSecretKey;
        System.out.println("Stripe API Key: " + Stripe.apiKey);
    }


    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(HttpServletResponse response,@RequestParam String type, @RequestParam String name,
                                                     @RequestParam long price) throws StripeException {
        System.out.println("Create Checkout Session");
        System.out.println("Stripe api key: " + Stripe.apiKey);
        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:4200/front-office/paiement/success")
                        .setCancelUrl("http://localhost:4200/front-office/paiement/cancel")
                        .setAllowPromotionCodes(true)
                        .setInvoiceCreation(
                                SessionCreateParams.InvoiceCreation.builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .putMetadata("product_name", type+":"+name)
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(price * 100)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName(type+":"+name)
                                                                        .build())
                                                        .build())
                                        .build())
                        .build();

        Session session = Session.create(params); //on success update reward point with paid amount

        Map<String, String> responseData = new HashMap<>();
        responseData.put("checkoutUrl", session.getUrl());
        return responseData;
    }

    @GetMapping("getPromo/{id_user}")
    public Map<String, Object> getPromotionCode(@PathVariable long id_user) throws StripeException {
        //get the points of that user
        //when the user clicks a button of transforming points
        User user = userService.getUserById(id_user);
        RewardPoints p = user.getRewardPoints();
        int points = p.getPoints();
        CouponCreateParams couponparams =
                CouponCreateParams.builder()
                        .setDuration(CouponCreateParams.Duration.FOREVER)
                        .setPercentOff(new BigDecimal(points/10))
                        .build();

        Coupon coupon = Coupon.create(couponparams);

        PromotionCodeCreateParams promotionparams =
                PromotionCodeCreateParams.builder().setCoupon(coupon.getId()).setExpiresAt
                        (Instant.now().getEpochSecond() + 7776000).setMaxRedemptions(1L).build();

        PromotionCode promotionCode = PromotionCode.create(promotionparams);
        p.setValue((float) (points/10));
        p.setPoints(0);
        p.setToken(promotionCode.getCode());
        p.setUpdated_at(new Date());
        p.setToken_applied(false);
        LocalDate date = LocalDate.now().plusMonths(3);
        Date validUntil = java.sql.Date.valueOf(date);
        p.setValid_until(validUntil);
        rewardPointsService.updateRewardPoints(p);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("points", p);
        responseData.put("token", promotionCode.getCode());
        return responseData;
    }

    @GetMapping("success")
    public String success() {return "success";}

    @GetMapping("failure")
    public String failure() {return "failure";}

    @GetMapping("/getCheckout")
    public String getCheckout() throws StripeException {
        SessionListParams params = SessionListParams.builder().setLimit(3L).build();
        SessionCollection sessions = Session.list(params);
        return sessions.toJson();
    }



    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload) throws StripeException, MessagingException, IOException, MessagingException, IOException {

        Event event = null;

        User user = null;

        double amount = 0;


        try {
            event = ApiResource.GSON.fromJson(payload, Event.class);
        } catch (JsonSyntaxException e) {
            // Invalid payload
            ResponseEntity.badRequest().body(e.getMessage());
        }

        // Deserialize the nested object inside the event
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;
        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        } else {
            // Deserialization failed, probably due to an API version mismatch.
            // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
            // instructions on how to handle this case, or return an error here.
        }
        System.out.println("Event type: " + event.getType());
        System.out.println("Event API version: " + event.getApiVersion());
        System.out.println("SDK API version: " + Stripe.API_VERSION);

        switch (event.getType()) {
            case "payment_intent.succeeded":
                PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
                System.out.println("Payment for " + paymentIntent.getAmount() + " succeeded."); // save the paiement with pi, amount and update reward points = amount / 10 and if coupon applied make point to 0 + new update
                // Then define and call a method to handle the successful payment intent.
                // handlePaymentIntentSucceeded(paymentIntent);
                // get amout, get payment method if card the type, get the percent_off if promo code applied,
                amount = paymentIntent.getAmount();
                System.out.println("amount="+amount);
                String currency = paymentIntent.getCurrency();
                PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentIntent.getPaymentMethod());
                String paymentMethodType = paymentMethod.getType(); // should be "card"

                paiement.setMontant((long) (amount/100));
                paiement.setDate_paiement(new Date());
                paiement.setMethode_paiement(paymentMethodType);

                break;

            case "checkout.session.completed":
                Session session = (Session) stripeObject;
                Session.CustomerDetails customerDetails = session.getCustomerDetails();
                String productName = session.getMetadata().get("product_name").split(":")[1];
                System.out.println("productName="+productName);

                Pack pack = packService.getPackByName(productName);
                paiement.setPack(pack);
                pack.getPaiements().add(paiement);

                paiement.setStatut(session.getPaymentStatus());
                RewardPoints points = null;
                if (customerDetails != null) {
                    String customerEmail = customerDetails.getEmail();
                    String customerName = customerDetails.getName();

                    System.out.println("Customer Email: " + customerEmail);
                    System.out.println("Customer Name: " + customerName);
                    PaymentIntent intent = PaymentIntent.retrieve(session.getPaymentIntent());
                    amount = intent.getAmount();
                    System.out.println("Amount from session: " + intent.getAmount());
                    System.out.println("amout from session: " + amount);
                    int updatedPoints = (int) (amount/1000);
                    user = userService.getUserByEmail(customerEmail);
                    points = rewardPointsService.getRewardPointsByUser(user.getId());
                    points.setPoints(updatedPoints);
                    points.setUpdated_at(new Date());
                    points.setValue((float) (updatedPoints/10));
                    paiement.setUser(user);
                    user.getPaiements().add(paiement);
                }

                if(!session.getDiscounts().isEmpty()){
                    Session.Discount discount = session.getDiscounts().get(0);
                    System.out.println("discount=="+discount);
                    String promoCodeId = discount.getPromotionCode();
                    PromotionCode promo = PromotionCode.retrieve(
                            promoCodeId,
                            Map.of("expand", List.of("coupon")),
                            null
                    );
                    Coupon coupon = promo.getCoupon();
                    System.out.println("💸 Percent off: " + coupon.getPercentOff());
                    System.out.println("💰 Amount off: " + coupon.getAmountOff());
                    paiement.setPercent_off(coupon.getPercentOff());
                    points.setToken_applied(true);
                    points.setValid_until(new Date());
                    points.setValue((float) 0);
                }

                Facture facture = new Facture();
                Invoice invoice = Invoice.retrieve(session.getInvoice());
                emailService.sendHtmlEmail(user.getFirstname() + ' ' + user.getLastname(),user.getEmail(),amount,new Date(),invoice.getInvoicePdf());
                String pdfUrl = invoice.getInvoicePdf();
                facture.setDate_emission(new Date());
                facture.setMontant_total((long) (amount/100));
                facture.setUrl(pdfUrl);
                facture.setUser(user);
                paiement.setFacture(facture);
                paiementService.addPaiement(paiement);
                rewardPointsService.updateRewardPoints(points);
                break;

            // ... handle other event types
            default:
                System.out.println("Unhandled event type: " + event.getType());
        }


        return ResponseEntity.ok("Webhook received");
    }




}




