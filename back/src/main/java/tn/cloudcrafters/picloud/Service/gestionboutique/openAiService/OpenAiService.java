package tn.cloudcrafters.picloud.Service.gestionboutique.openAiService;

import okhttp3.*;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class OpenAiService {


    private final String API_KEY = "";
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    public String callOpenAi(String prompt) throws IOException {
        OkHttpClient client = new OkHttpClient();
        String jsonBody = "{\n" +
                "  \"model\": \"gpt-3.5-turbo\",\n" +
                "  \"messages\": [\n" +
                "    {\"role\": \"user\", \"content\": \"" + prompt.replace("\"", "\\\"") + "\"}\n" +
                "  ]\n" +
                "}";

        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));
        Request request = new Request.Builder()
                .url(API_URL)
                .post(body)
                .addHeader("Authorization", API_KEY)
                .addHeader("Content-Type", "application/json")
                .build();

        int retries = 3;
        int waitTime = 2000;  // Initial wait time in milliseconds (2 seconds)

        for (int i = 0; i < retries; i++) {
            try (Response response = client.newCall(request).execute()) {
                if (response.code() == 429) {
                    // Attendre avant de réessayer
                    Thread.sleep(waitTime);
                    waitTime *= 2;  // Double le temps d'attente à chaque tentative
                    continue;
                }

                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected code " + response);
                }

                String responseBody = response.body().string();
                JSONObject json = new JSONObject(responseBody);
                return json.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content");
            } catch (IOException | InterruptedException e) {
                if (i == retries - 1) {
                    throw new IOException("Erreur après plusieurs tentatives : " + e.getMessage());
                }
            }
        }

        throw new IOException("Impossible d'obtenir une réponse après plusieurs tentatives.");
    }

}
