package tn.cloudcrafters.picloud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")  // Permet les requêtes depuis le front-end sur http://localhost:4200

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    // Exemple d'un endpoint WebSocket qui envoie un message à un utilisateur particulier
    @MessageMapping("/send")
    public void sendMessage(String message) {
        // Envoie le message à tous les abonnés à un topic
        simpMessagingTemplate.convertAndSend("/topic/messages", message);
    }
}
