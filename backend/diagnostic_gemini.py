import os
import django
import json
import requests

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
from backend.utils.gemini import GeminiClient

def diagnostic():
    client = GeminiClient()
    prompt = "Generate exactly 1 technical interview question for a Frontend Developer position. Return ONLY a valid JSON array of objects with id, question, type."
    
    print(f"Using API Key: {settings.GEMINI_API_KEY[:10]}...")
    
    # Test raw requests first
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    headers = {"Content-Type": "application/json"}
    
    print("\n--- Raw Request Test ---")
    try:
        response = requests.post(url, headers=headers, json=payload, verify=False, timeout=30)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response text length:", len(response.text))
            print("Response snippet:", response.text[:200])
        else:
            print("Error text:", response.text)
    except Exception as e:
        print(f"Raw Request Exception: {str(e)}")

    print("\n--- GeminiClient.generate_content Test ---")
    result = client.generate_content(prompt)
    print("Result snippet:", result[:200])

if __name__ == "__main__":
    diagnostic()
