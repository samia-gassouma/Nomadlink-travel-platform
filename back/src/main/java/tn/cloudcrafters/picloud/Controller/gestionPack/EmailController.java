package tn.cloudcrafters.picloud.Controller.gestionPack;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.EmailRequest;
import tn.cloudcrafters.picloud.Service.MailSenderService;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/email") // ✅ Définition du préfixe de l’API
public class EmailController {

    @Autowired
    private MailSenderService mailSenderService;

    // ✅ Endpoint pour envoyer un e-mail
    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        mailSenderService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
        return "✅ E-mail envoyé à " + emailRequest.getTo();
    }

    @GetMapping("/test")
    public String testEmail() {
        mailSenderService.testEmail();
        return "✅ Test d'envoi réussi !";
    }
    @PostMapping("/send-with-pdf")
    public String sendEmailWithPDF(
            @RequestParam("email") String email,
            @RequestParam("subject") String subject,
            @RequestParam("body") String body,
            @RequestParam("pdfFile") MultipartFile pdfFile) throws IOException, MessagingException {

        String filePath = "uploads/confirmation_reservation.pdf";
        File file = new File(filePath);
        pdfFile.transferTo(file); // ✅ Sauvegarder temporairement le fichier PDF

        mailSenderService.sendEmailWithAttachment(email, subject, body, filePath);
        return "✅ E-mail avec PDF envoyé à " + email;
    }

}
