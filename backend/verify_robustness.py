import os
import django
import json

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.utils.gemini import GeminiClient

def test_gemini_robustness():
    client = GeminiClient()
    
    # Mock generate_content to return an error JSON
    print("Testing error handling in generate_interview_questions...")
    original_generate_content = client.generate_content
    client.generate_content = lambda prompt: json.dumps({"error": "Simulated API Error"})
    
    questions = client.generate_interview_questions("Frontend Developer", "Technical", 5)
    print(f"Result type: {type(questions)}")
    if isinstance(questions, list) and len(questions) == 5:
        print("PASS: Handled API error and returned fallback list of length 5.")
    else:
        print(f"FAIL: Expected list of 5, got {type(questions)} of length {len(questions) if hasattr(questions, '__len__') else 'N/A'}")

    print("\nTesting error handling in evaluate_interview_performance...")
    evaluation = client.evaluate_interview_performance("Frontend Developer", "Technical", [])
    print(f"Result type: {type(evaluation)}")
    expected_keys = ["score", "feedback", "strengths", "improvements", "summary"]
    if isinstance(evaluation, dict) and all(key in evaluation for key in expected_keys):
        print("PASS: Handled API error and returned fallback dict with all expected keys.")
        if "(Mock evaluation due to API error)" in evaluation["summary"]:
             print("PASS: Fallback indicator found in summary.")
    else:
        print(f"FAIL: Expected dict with keys {expected_keys}, got {evaluation}")

if __name__ == "__main__":
    test_gemini_robustness()
