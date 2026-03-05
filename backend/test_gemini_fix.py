import os
import django
import json

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.utils.gemini import GeminiClient

def test_gemini_mock():
    client = GeminiClient()
    
    # Test generate_interview_questions
    print("Testing generate_interview_questions...")
    # Simulate a failure by temporarily changing the model name to something invalid or just using the real one
    # But since I want to see how it handles THE RESPONSE from generate_content...
    
    # Let's mock generate_content to return an error JSON
    original_generate_content = client.generate_content
    client.generate_content = lambda prompt: json.dumps({"error": "Simulated API Error"})
    
    questions = client.generate_interview_questions("Frontend Developer", "Technical", 5)
    print(f"Result type: {type(questions)}")
    print(f"Result: {questions}")
    
    if isinstance(questions, dict) and "error" in questions:
        print("FAIL: Returned error dict instead of list!")
    else:
        print("PASS: Handled error correctly (likely returned fallback list)")

if __name__ == "__main__":
    test_gemini_mock()
