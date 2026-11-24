package tn.cloudcrafters.picloud.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;

@Service
public class EmailServicepaiment {
    @Autowired
    private JavaMailSender mailSender;

    public void sendHtmlEmail(String username, String email, double amount, Date date , String invoiceUrl) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);


        String htmlContent = String.format("""
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #2e7d32; text-align: center;">✅ Payment Successful!</h2>
                <p style="font-size: 16px; color: #333;">
                    Dear %s,<br><br>
                    We are pleased to inform you that your payment has been processed successfully.
                </p>
                <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                    <p style="font-size: 14px; color: #555;">
                        <strong>Amount:</strong> $%s<br>
                        <strong>Date:</strong> %s
                    </p>
                </div>
                <p style="font-size: 14px; color: #777; margin-top: 30px;">
                    If you have any questions, feel free to contact our support team.<br><br>
                    Thank you for choosing us!
                </p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://nomadLink.com" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Visit Our Website
                    </a>
                </div>
            </div>
        </div>
        """,username,amount,date.toString());

        //message.setFrom(new InternetAddress("support@cloudcrafters.com", "CloudCrafters Support"));

        helper.setTo(email);
        helper.setSubject("Payment Confirmation");
        helper.setText(htmlContent, true); // true = HTML



        URL url = new URL(invoiceUrl);

        String fileName = "invoice.pdf"; // fallback name

        InputStream inputStream = url.openStream();

        InputStreamSource attachmentSource = new ByteArrayResource(inputStream.readAllBytes());

        helper.addAttachment(fileName, attachmentSource);

        mailSender.send(message);
    }
}
