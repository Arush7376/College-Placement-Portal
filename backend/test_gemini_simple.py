import google.generativeai as genai
import os
from django.conf import settings
import django
import json

# Setup Django standalone
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_question_generation():
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        print("ERROR: No API Key found.")
        return

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        subject = "DSA"
        topic = "Arrays"
        difficulty = "Easy"
        count = 2
        question_type = "MCQ"

        print(f"Generating {count} {difficulty} {subject} questions...")
        
        prompt = f"""
        Generate {count} {difficulty} level {question_type} questions on {subject} - {topic}.
        
        Format the output as a strictly valid JSON array of objects. 
        Do not allow any markdown formatting or code blocks in the output.
        The output should be raw JSON.

        If question_type is 'MCQ', each object should have:
        - id: number
        - question: string
        - options: array of 4 strings
        - correct_answer: index (0-3) or string matching one option accurately
        - explanation: string
        """
        
        response = model.generate_content(prompt)
        text = response.text
        print(f"Raw Response: {text[:200]}...")

        # simulate cleanup
        clean_response = text.replace('```json', '').replace('```', '').strip()
        if clean_response.startswith('json'): 
            clean_response = clean_response[4:].strip()

        data = json.loads(clean_response)
        print(f"SUCCESS: Parsed {len(data)} questions.")
        print("Sample Question:", data[0]['question'])

    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    test_question_generation()
