import os
import sys
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.utils.gemini import GeminiClient

print("Testing GeminiClient.generate_questions...")
client = GeminiClient()
try:
    result = client.generate_questions(
        subject="DSA", 
        topic="Arrays", 
        difficulty="Easy", 
        count=1, 
        question_type="Coding"
    )
    print("RESULT:")
    print(result)
except Exception as e:
    print(f"FAILURE: {str(e)}")
