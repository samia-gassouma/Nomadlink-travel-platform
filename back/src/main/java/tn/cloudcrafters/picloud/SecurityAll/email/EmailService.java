package tn.cloudcrafters.picloud.SecurityAll.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
//    private  final JavaMailSender mailSender;
//    private  final SpringTemplateEngine templateEngine;
//
//    @Async
//    public void sendEmail(
//            String to,
//            String username,
//            EmailTemplateName emailTemplate,
//            String confirmationUrl,
//            String activationCode,
//            String subject
//    ) throws MessagingException {
//        String templateName;
//        if (emailTemplate == null) {
//            templateName = "confirm-email";
//        } else {
//            templateName = emailTemplate.name();
//        }
//        MimeMessage mimeMessage = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(
//                mimeMessage,
//                MULTIPART_MODE_MIXED,
//                UTF_8.name()
//        );
//        Map<String, Object> properties = new HashMap<>();
//        properties.put("username", username);
//        properties.put("confirmationUrl", confirmationUrl);
//        properties.put("activation_code", activationCode);
//
//        Context context = new Context();
//        context.setVariables(properties);
//
//        helper.setFrom("sahrourasahara@gmail.com");
//        helper.setTo(to);
//        helper.setSubject(subject);
//
//        String template = templateEngine.process(templateName, context);
//
//        helper.setText(template, true);
//
//        mailSender.send(mimeMessage);
//    }
private final JavaMailSender mailSender;

    @Async
    public void sendEmail(String to, String subject, String text) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("ton-email@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true); // true pour activer HTML

        mailSender.send(message);
    }


}