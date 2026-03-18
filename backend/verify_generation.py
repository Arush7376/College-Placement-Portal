import os
import sys
import django
import json

# Setup Django environment
sys.path.append(r'c:\college-placement-platform\College-Placement-Portal\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.utils.gemini import GeminiClient

def verify_generation():
    client = GeminiClient()
    
    print("--- Verifying Question Generation ---")
    try:
        # Test MCQ Generation
        result = client.generate_questions("Python", "Lists", "Easy", 1, "MCQ")
        parsed = json.loads(result)
        if isinstance(parsed, list) and len(parsed) > 0:
            print("SUCCESS: Generated MCQ questions correctly.")
            print(f"Sample Question: {parsed[0]['question']}")
        else:
            print(f"FAILED: Unexpected response format: {type(parsed)}")
            
        # Test Coding Generation
        result_coding = client.generate_questions("Python", "Arrays", "Medium", 1, "Coding")
        parsed_coding = json.loads(result_coding)
        if isinstance(parsed_coding, list) and len(parsed_coding) > 0:
            print("SUCCESS: Generated Coding questions correctly.")
            print(f"Sample Title: {parsed_coding[0]['title']}")
        else:
            print(f"FAILED: Unexpected coding response format: {type(parsed_coding)}")
            
    except Exception as e:
        print(f"ERROR: Verification failed with: {str(e)}")

if __name__ == "__main__":
    verify_generation()
