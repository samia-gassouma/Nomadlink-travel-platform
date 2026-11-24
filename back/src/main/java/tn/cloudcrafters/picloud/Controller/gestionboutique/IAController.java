package tn.cloudcrafters.picloud.Controller.gestionboutique;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.cloudcrafters.picloud.Service.gestionboutique.openAiService.OpenAiService;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ia")
@CrossOrigin("http://localhost:4200")
public class IAController {

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/resumer")
    public ResponseEntity<String> resumeTexte(@RequestBody Map<String, String> body) {
        String texte = body.get("texte");
        String prompt = "Résume ce texte en français : " + texte;

        try {
            String result = openAiService.callOpenAi(prompt);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }

    @PostMapping("/idees-produit")
    public ResponseEntity<?> genererIdeesProduit(@RequestBody Map<String, String> data) {
        String theme = data.get("theme");
        String description = data.get("description");

        if (theme == null || theme.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("La catégorie (theme) est manquante.");
        }

        String prompt = "Propose 5 idées de produits dans la catégorie : " + theme;
        if (description != null && !description.isBlank()) {
            prompt += ". Description : " + description;
        }

        try {
            String result = openAiService.callOpenAi(prompt);
            // parser en liste ?
            List<String> ideas = Arrays.asList(result.split("\\n"));
            return ResponseEntity.ok(ideas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }

    @PostMapping("/corriger")
    public ResponseEntity<String> corrigerTexte(@RequestBody Map<String, String> body) {
        String texte = body.get("texte");
        String prompt = "Corrige les fautes d’orthographe et de grammaire dans ce texte en français : " + texte;

        try {
            return ResponseEntity.ok(openAiService.callOpenAi(prompt));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }
}
