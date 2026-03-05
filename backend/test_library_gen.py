import os
import django
import json
import google.generativeai as genai

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings

def test_library_gen():
    api_key = settings.GEMINI_API_KEY
    print(f"Testing Library with Key: {api_key[:10]}...")
    
    try:
        genai.configure(api_key=api_key, transport='rest')
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Generate 1 interview question for Frontend. Return JSON.")
        print("SUCCESS!")
        print("Response text:", response.text[:200])
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    test_library_gen()
