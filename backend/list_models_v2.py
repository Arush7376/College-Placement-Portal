import os
import django
import google.generativeai as genai

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings

def list_models():
    api_key = settings.GEMINI_API_KEY
    print(f"Listing models with Key: {api_key[:10]}...")
    
    try:
        genai.configure(api_key=api_key, transport='rest')
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"Model: {m.name}")
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    list_models()
