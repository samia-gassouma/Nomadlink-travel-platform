package tn.cloudcrafters.picloud.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class MailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("ton-email@gmail.com");

            mailSender.send(message);
            System.out.println("✅ E-mail envoyé à : " + to);
        } catch (Exception e) {
            System.err.println("❌ Erreur d'envoi de mail : " + e.getMessage());
        }
    }


    public void sendEmailWithAttachment(String to, String subject, String body, String filePath) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);

        File file = new File(filePath);
        if (file.exists()) {
            helper.addAttachment("confirmation_reservation.pdf", file);
        } else {
            System.out.println("❌ Fichier introuvable : " + filePath);
        }

        mailSender.send(message);
    }
    public void testEmail() {
        sendEmail("client@example.com", "Test Email", "Si tu vois ce message, l'envoi d'e-mails fonctionne !");
    }

}
