from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import pandas as pd

class TravelQASystem:
    """A simple question answering system for travel planning using TF-IDF and cosine similarity."""

    def __init__(self):
        """Initialize the QA system with an empty knowledge base and vectorizer."""
        self.knowledge_base = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.vectors = None

    def add_knowledge(self, documents):
        """
        Add documents to the knowledge base.

        Args:
            documents: List of dictionaries with 'Question' and 'Response' keys
        """
        self.knowledge_base.extend(documents)
        # Extract questions for vectorization
        questions = [doc['Question'] for doc in self.knowledge_base]
        # Fit and transform the vectorizer on all questions
        self.vectors = self.vectorizer.fit_transform(questions)
        print(f"Added {len(documents)} documents. Knowledge base now contains {len(self.knowledge_base)} items.")

    def load_knowledge_from_file(self, filepath, file_format='json'):
        """
        Load knowledge base from a file.

        Args:
            filepath: Path to the file
            file_format: Format of the file ('json', 'csv', 'excel')
        """
        try:
            if file_format.lower() == 'json':
                with open(filepath, 'r') as f:
                    documents = json.load(f)
                self.add_knowledge(documents)

            elif file_format.lower() == 'csv':
                df = pd.read_csv(filepath)
                # Convert DataFrame to list of dictionaries
                documents = df.to_dict('records')
                self.add_knowledge(documents)

            elif file_format.lower() in ['excel', 'xlsx', 'xls']:
                df = pd.read_excel(filepath)
                # Convert DataFrame to list of dictionaries
                documents = df.to_dict('records')
                self.add_knowledge(documents)

            else:
                print(f"Unsupported file format: {file_format}")
                return False

            return True

        except Exception as e:
            print(f"Error loading knowledge base: {e}")
            return False

    def save_knowledge_to_file(self, filepath, file_format='json'):
        """
        Save the current knowledge base to a file.

        Args:
            filepath: Path to save the file
            file_format: Format to save the file ('json', 'csv', 'excel')
        """
        try:
            if file_format.lower() == 'json':
                with open(filepath, 'w') as f:
                    json.dump(self.knowledge_base, f, indent=2)

            elif file_format.lower() == 'csv':
                df = pd.DataFrame(self.knowledge_base)
                df.to_csv(filepath, index=False)

            elif file_format.lower() in ['excel', 'xlsx', 'xls']:
                df = pd.DataFrame(self.knowledge_base)
                df.to_excel(filepath, index=False)

            else:
                print(f"Unsupported file format: {file_format}")
                return False

            print(f"Knowledge base saved to {filepath}")
            return True

        except Exception as e:
            print(f"Error saving knowledge base: {e}")
            return False

    def answer_question(self, question, top_n=3, similarity_threshold=0.3):
        """
        Find the most relevant answer to the given question.

        Args:
            question: The question string
            top_n: Number of closest matches to consider
            similarity_threshold: Minimum similarity score to be considered a match

        Returns:
            Dictionary with the answer and metadata, or None if no good match
        """
        if not self.knowledge_base:
            return {"Response": "I don't have any knowledge about travel planning yet.", "confidence": 0}

        # Transform the question using the vectorizer
        question_vector = self.vectorizer.transform([question])

        # Calculate similarity scores
        similarity_scores = cosine_similarity(question_vector, self.vectors)[0]

        # Get the indices of the top N similar questions
        top_indices = similarity_scores.argsort()[-top_n:][::-1]

        # Check if the best match exceeds the threshold
        if similarity_scores[top_indices[0]] < similarity_threshold:
            return {
                "Response": "I don't have enough information to answer that question accurately.",
                "confidence": float(similarity_scores[top_indices[0]]),
                "similar_questions": [self.knowledge_base[i]['Question'] for i in top_indices[:3]]
            }

        # Return the best matching answer
        best_match = self.knowledge_base[top_indices[0]]
        return {
            "Response": best_match['Response'],
            "confidence": float(similarity_scores[top_indices[0]]),
            "question_matched": best_match['Question'],
            "similar_questions": [self.knowledge_base[i]['Question'] for i in top_indices[1:3]]
        }
