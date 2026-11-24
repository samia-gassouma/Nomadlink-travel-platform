# NomadLink - Chatbot voyage IA

Ce module fournit une API de voyage intelligente utilisée depuis l'interface Angular NomadLink.

## Fonctionnalités

- réponses à partir d'une base de connaissances voyage ;
- génération de réponses avec un modèle Llama 2 7B fine-tuné ;
- recherche des questions proches par TF-IDF ;
- calcul de similarité cosinus ;
- ajout, sauvegarde et chargement des connaissances ;
- prise en charge JSON, CSV et Excel ;
- API CORS utilisable depuis Angular.

## Technologies

- Python
- Flask
- Flask-CORS
- Hugging Face Transformers
- PyTorch
- scikit-learn
- pandas
- openpyxl

## Architecture

```text
Angular AiChatComponent
        |
        v
Flask API port 5000
        |
        +--> TravelQASystem
        |      +--> TF-IDF
        |      +--> Cosine similarity
        |
        +--> Hugging Face Transformers
               +--> Llama 2 7B fine-tuné
```

## Installation

```bash
cd travel_chatbot
python -m venv .venv
.venv\Scripts\activate
pip install flask flask-cors transformers torch scikit-learn pandas openpyxl
python app.py
```

L'API est disponible sur `http://localhost:5000`.

## Docker

Build the image from the `travel_chatbot` directory:

```bash
docker build -t nomadlink-ai .
```

The model loader uses `local_files_only=True`, so the Hugging Face model must already be present in a local cache. Mount that cache into the container when starting it:

```bash
docker run --rm -p 5000:5000 \
  -v "$HOME/.cache/huggingface:/home/app/.cache/huggingface:ro" \
  nomadlink-ai
```

This image installs CPU-only PyTorch. Model inference can therefore be slower than on a GPU-enabled host.

## Modèle

Le serveur charge depuis Hugging Face :

```text
samia4566/llama2-7B-finetuned-chat-guanaco
```

Le modèle fine-tuné est publié et disponible sur Hugging Face :  
https://huggingface.co/samia4566/llama2-7B-finetuned-chat-guanaco

Le modèle est chargé avec `local_files_only=True`. Il doit donc avoir été téléchargé dans le cache local avant le démarrage.

## Entraînement Llama 2

Le processus de fine-tuning est fourni dans [LLAMA_2.ipynb](LLAMA_2.ipynb).

### Configuration

| Élément | Valeur |
|---|---|
| Environnement | Google Colab |
| GPU enregistré | NVIDIA T4 |
| Modèle de base | `NousResearch/Llama-2-7b-chat-hf` |
| Dataset | `mlabonne/guanaco-llama2-1k` |
| Modèle fine-tuné | `samia4566/llama2-7B-finetuned-chat-guanaco` |
| Approche | Supervised Fine-Tuning avec LoRA |
| Champ du dataset | `text` |
| Séquence maximale | 512 tokens |
| Époques | 3 |
| Batch size par appareil | 8 |
| Gradient accumulation | 1 |
| LoRA rank | 64 |
| LoRA alpha | 16 |
| LoRA dropout | 0.1 |
| Learning rate | `2e-5` |
| Warmup ratio | 0.03 |
| Weight decay | 0.01 |
| Optimiseur | AdamW |
| Scheduler | constant avec warmup |
| Précision | FP16 |
| Gradient checkpointing | activé |
| Suivi | TensorBoard |

Le notebook déclare également une configuration 4-bit NF4 avec quantization double désactivée, mais le chargement de base exécuté dans les cellules utilise `torch.float32` et `device_map="cpu"`. Cette distinction doit être prise en compte lors de la reproduction exacte de l'entraînement.

### Résultats observés

- 375 étapes globales ;
- 3.0 époques ;
- perte d'entraînement finale : `1.547227` ;
- durée d'entraînement : `3100.9964` secondes ;
- débit : `0.967` échantillons/seconde ;
- débit de pas : `0.121` étape/seconde ;
- le modèle est publié sur Hugging Face avec `push_to_hub=True`.

Le notebook contient aussi des tests de génération avec des questions comme « Who is Leonardo Da Vinci? ». Aucun jeu de validation dédié ni métrique de benchmark n'est enregistré dans les sorties disponibles.

## Base de connaissances

`TravelQASystem` transforme les questions avec `TfidfVectorizer` puis calcule leur similarité avec la question utilisateur.

Si le meilleur score dépasse le seuil configuré, la réponse correspondante est retournée avec :

- le texte de réponse ;
- le score de confiance ;
- la question correspondante ;
- les questions similaires.

## Endpoints

| Méthode | Route | Fonction |
|---|---|---|
| GET | `/` | état du service |
| POST | `/api/ask` | recherche dans la base QA |
| GET | `/api/content` | liste des connaissances |
| POST | `/api/content` | ajout d'une ou plusieurs connaissances |
| POST | `/api/content/file` | sauvegarde ou chargement d'un fichier |
| POST | `/api/generate` | génération par Llama 2 |

### Exemple `/api/generate`

```json
{
  "prompt": "What should I pack for a beach vacation?"
}
```

### Exemple `/api/ask`

```json
{
  "question": "How can I find cheap flights?",
  "top_n": 3,
  "similarity_threshold": 0.3
}
```

## Intégration Angular

Le service `TravelQaService` appelle `/api/generate`. Le composant `AiChatComponent` transmet le message utilisateur et affiche la réponse générée.

## Captures d'écran

```md
![Interface du chatbot](screenshots/travel-chatbot.png)
![Test de réponse voyage](screenshots/travel-chatbot-test.png)
```

## Notes

- le modèle peut nécessiter beaucoup de RAM/GPU ;
- le cache du modèle doit être préparé hors de l'application ;
- la base de connaissances peut être étendue par API ;
- les données de domaine peuvent être sauvegardées dans JSON, CSV ou Excel.
