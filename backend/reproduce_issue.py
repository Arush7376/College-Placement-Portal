import os
import django
import json

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.utils.gemini import GeminiClient

def test_questions():
    client = GeminiClient()
    print(f"Testing GeminiClient with model: {client.model_name}")
    
    # Try different standard models if one fails
    models_to_try = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest']
    
    for model_name in models_to_try:
        print(f"\n--- Testing model: {model_name} ---")
        client.model_name = model_name
        client.model = client.import_genai().GenerativeModel(model_name)
        
        try:
            questions = client.generate_interview_questions("Frontend Developer", "Technical", 2)
            print("Response type:", type(questions))
            print("Response sample:", json.dumps(questions, indent=2))
            
            # Check if it's the mock response
            if any("Mock Technical question" in q.get('question', '') for q in questions):
                print("RESULT: FAILURE (Got Mock Data)")
            else:
                print("RESULT: SUCCESS (Got Real Questions)")
                break
        except Exception as e:
            print(f"Caught exception: {str(e)}")

# Add a helper to allow dynamic model selection in GeminiClient if needed for this test
def patch_client():
    import google.generativeai as genai
    GeminiClient.import_genai = lambda x: genai

if __name__ == "__main__":
    patch_client()
    test_questions()
