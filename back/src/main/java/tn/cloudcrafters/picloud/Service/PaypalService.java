package tn.cloudcrafters.picloud.Service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.OAuthTokenCredential;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class PaypalService {
    public PaypalService(@Value("${paypal.client.id}") String clientId, @Value("${paypal.client.secret}") String clientSecret) {
        System.out.println("🔍 PAYPAL_CLIENT_ID = " + clientId);
        System.out.println("🔍 PAYPAL_CLIENT_SECRET = " + clientSecret);
    }

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    /** ✅ Initialiser l'API PayPal **/
    private APIContext getAPIContext() {
        try {
            String accessToken = new OAuthTokenCredential(clientId, clientSecret).getAccessToken();
            return new APIContext(accessToken);
        } catch (PayPalRESTException e) {
            throw new RuntimeException("❌ Erreur PayPal : " + e.getMessage());
        }
    }

    /** ✅ Créer un paiement PayPal **/
    public Payment createPayment(Double total, String currency, String method, String intent, String description, String cancelUrl, String successUrl) {
        System.out.println("🔍 Création du paiement : montant=" + total + ", devise=" + currency);

        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format("%.2f", total));

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(description);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(Collections.singletonList(transaction));

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        try {
            APIContext apiContext = getAPIContext();
            return payment.create(apiContext);
        } catch (PayPalRESTException e) {
            System.err.println("❌ Erreur PayPal : " + e.getMessage());  // ✅ Ajout de log pour voir l’erreur exacte
            throw new RuntimeException("❌ Erreur lors de la création du paiement PayPal : " + e.getMessage());
        }
    }

    public Payment capturePayment(String paymentId, String payerId) {
        try {
            APIContext apiContext = getAPIContext();
            Payment payment = new Payment();
            payment.setId(paymentId);
            PaymentExecution paymentExecution = new PaymentExecution();
            paymentExecution.setPayerId(payerId);
            return payment.execute(apiContext, paymentExecution);
        } catch (PayPalRESTException e) {
            throw new RuntimeException("❌ Erreur lors de la capture du paiement PayPal : " + e.getMessage());
        }
    }

}
