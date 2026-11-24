package tn.cloudcrafters.picloud.Service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendFlightUpdate(String flightUpdate) {
        messagingTemplate.convertAndSend("/topic/flights", flightUpdate); // Envoi du message aux abonnés
    }
}
