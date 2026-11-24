package tn.cloudcrafters.picloud.Controller;

import com.paypal.api.payments.Payment;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.PaypalPayment;
import tn.cloudcrafters.picloud.Service.PaypalService;

@CrossOrigin(origins = "*") // ✅ Autorise toutes les requêtes HTTP
@RestController
@RequestMapping("/api/paypal")
public class PaypalController {

    private final PaypalService paypalService;

    public PaypalController(PaypalService paypalService) {
        this.paypalService = paypalService;
    }

    /** ✅ Créer un paiement PayPal et obtenir l’URL de validation **/
    @PostMapping("/create-payment")
    public String createPayment(@RequestBody PaypalPayment request) {
        System.out.println("🔍 Création du paiement avec montant : " + request.getAmount()); // ✅ Ajout de log

        Payment payment = paypalService.createPayment(
                request.getAmount(),
                request.getCurrency(),
                request.getMethod(),
                request.getIntent(),
                request.getDescription(),
                request.getCancelUrl(),
                request.getSuccessUrl()
        );

        return payment.getLinks().stream()
                .filter(link -> "approval_url".equals(link.getRel()))
                .findFirst()
                .map(link -> link.getHref())
                .orElseThrow(() -> new RuntimeException("❌ Erreur : URL de paiement introuvable"));
    }


    @PostMapping("/capture-payment")
    public Payment capturePayment(@RequestParam String paymentId, @RequestParam String payerId) {
        System.out.println("🔍 Capture du paiement: paymentId=" + paymentId + ", payerId=" + payerId); // ✅ Ajout de log
        try {
            return paypalService.capturePayment(paymentId, payerId);
        } catch (Exception e) {
            throw new RuntimeException("❌ Erreur lors de la capture du paiement PayPal : " + e.getMessage());
        }
    }

}
