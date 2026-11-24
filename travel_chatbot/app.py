from flask import Flask, request, jsonify
from flask_cors import CORS

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    pipeline,
)
import re

from TravelQASystem import TravelQASystem



model_path = ('samia4566/llama2-7B-finetuned-chat-guanaco')
model = AutoModelForCausalLM.from_pretrained(model_path ,local_files_only=True
)
model.config.use_cache = True
model.config.pretraining_tp = 1

tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)


text_gen_pipe = pipeline(
    task="text-generation",
    model=model,
    tokenizer=tokenizer,
    max_length=150,
    config={"language": "en"}
)


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the QA system
travel_qa = TravelQASystem()

# Add some initial knowledge
initial_knowledge = [
    {
        "Question": "What should I pack for a beach vacation?",
        "Response": "For a beach vacation, essentials include swimwear, sunscreen (SPF 30+), sunglasses, hat, light clothing, sandals, a beach towel, and a good book. Don't forget a reusable water bottle and any medications you might need."
    },
    {
        "Question": "How early should I arrive at the airport for an international flight?",
        "Response": "For international flights, it's recommended to arrive at the airport 3 hours before departure. This allows time for check-in, security screening, customs procedures, and any unexpected delays."
    },
    {
        "Question": "What's the best way to exchange currency for international travel?",
        "Response": "The best ways to exchange currency are: 1) Use ATMs at your destination (often best rates but check your bank's fees), 2) Exchange some money before departure for immediate needs, 3) Use credit cards with no foreign transaction fees for larger purchases. Avoid airport currency exchanges which typically have poor rates."
    },
    {
        "Question": "How can I find cheap flights?",
        "Response": "To find cheap flights: 1) Use flight comparison sites like Skyscanner or Google Flights, 2) Be flexible with dates and consider mid-week flights, 3) Book 1-3 months in advance for best prices, 4) Set fare alerts, 5) Consider nearby airports, and 6) Clear your cookies or use incognito mode when searching repeatedly."
    },
    {
        "Question": "What are some tips for traveling on a budget?",
        "Response": "Budget travel tips: 1) Travel during off-peak seasons, 2) Stay in hostels, guesthouses or use Airbnb, 3) Use public transportation, 4) Cook some of your own meals, 5) Look for free attractions and city passes, 6) Travel with a refillable water bottle, and 7) Research local eating spots away from tourist areas for better prices and authentic experiences."
    }
]
travel_qa.add_knowledge(initial_knowledge)

@app.route('/')
def home():
    """Serve a simple home page."""
    return jsonify({
        "status": "online",
        "message": "Travel QA API is running. Send POST requests to /api/ask to ask questions."
    })

@app.route('/api/ask', methods=['POST'])
def ask_question():
    """API endpoint to answer travel questions."""
    if not request.json or 'question' not in request.json:
        return jsonify({"error": "Please provide a question in the request body"}), 400

    question = request.json['question']

    # Optional parameters
    top_n = request.json.get('top_n', 3)
    similarity_threshold = request.json.get('similarity_threshold', 0.3)

    # Get answer from QA system
    result = travel_qa.answer_question(question, top_n, similarity_threshold)

    return jsonify(result)

@app.route('/api/content', methods=['GET'])
def get_knowledge():
    """API endpoint to retrieve all knowledge base entries."""
    return jsonify(travel_qa.knowledge_base)

@app.route('/api/content', methods=['POST'])
def add_knowledge():
    """API endpoint to add new entries to the knowledge base."""
    if not request.json:
        return jsonify({"error": "Please provide data in the request body"}), 400

    # Check if we're getting a single entry or a list
    if isinstance(request.json, list):
        entries = request.json
    else:
        entries = [request.json]

    # Validate each entry
    valid_entries = []
    for entry in entries:
        if 'Question' in entry and 'Response' in entry:
            valid_entries.append({
                'Question': entry['Question'],
                'Response': entry['Response']
            })

    if not valid_entries:
        return jsonify({"error": "No valid entries provided. Each entry must have 'Question' and 'Response' fields"}), 400

    # Add to knowledge base
    travel_qa.add_knowledge(valid_entries)

    return jsonify({
        "status": "success",
        "message": f"Added {len(valid_entries)} entries to knowledge base",
        "total_entries": len(travel_qa.knowledge_base)
    })

@app.route('/api/content/file', methods=['POST'])
def handle_knowledge_file():
    """API endpoint to save or load the knowledge base to/from a file."""
    if not request.json or 'action' not in request.json or 'filepath' not in request.json:
        return jsonify({
            "error": "Please provide 'action' (save/load), 'filepath', and optional 'file_format' in the request body"
        }), 400

    action = request.json['action'].lower()
    filepath = request.json['filepath']
    file_format = request.json.get('file_format', 'json').lower()

    if file_format not in ['json', 'csv', 'excel', 'xlsx', 'xls']:
        return jsonify({"error": f"Unsupported file format: {file_format}"}), 400

    if action == 'save':
        success = travel_qa.save_knowledge_to_file(filepath, file_format)
        if success:
            return jsonify({"status": "success", "message": f"Knowledge base saved to {filepath}"})
        else:
            return jsonify({"status": "error", "message": "Failed to save knowledge base"}), 500

    elif action == 'load':
        success = travel_qa.load_knowledge_from_file(filepath, file_format)
        if success:
            return jsonify({
                "status": "success",
                "message": f"Knowledge base loaded from {filepath}",
                "total_entries": len(travel_qa.knowledge_base)
            })
        else:
            return jsonify({"status": "error", "message": f"Failed to load knowledge base from {filepath}"}), 500

    else:
        return jsonify({"error": f"Unsupported action: {action}. Use 'save' or 'load'"}), 400
    
@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')
    print(prompt)

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    formatted_prompt = f"<s>[INST] {prompt} [/INST]"
    result = text_gen_pipe(formatted_prompt)
    generated_text = result[0]['generated_text']
    cleaned_text = re.sub(r"\[INST\].*?\[/INST\]", "", generated_text, flags=re.DOTALL)
    cleaned_text = cleaned_text.replace("<s>", "").strip()
    print(cleaned_text)

    return jsonify({"generated_text": cleaned_text})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)