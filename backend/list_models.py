import google.generativeai as genai
from django.conf import settings
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

genai.configure(api_key=settings.GEMINI_API_KEY)

print("Listing models...")
with open('models_list.txt', 'w', encoding='utf-8') as f:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            f.write(m.name + '\n')
print("Done.")
