import os
import sys
import django
import json

# Setup Django environment
sys.path.append(r'c:\college-placement-platform\College-Placement-Portal\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.utils.gemini import GeminiClient

def verify_structure():
    client = GeminiClient()
    
    print("--- Verifying Interview Evaluation ---")
    interview_answers = [
        {"question": "Tell me about yourself.", "answer": "I am a software engineer."},
    ]
    res1 = client.evaluate_interview_performance("Engineer", "Technical", interview_answers)
    keys1 = ["score", "summary", "strengths", "improvements", "feedback"]
    missing1 = [k for k in keys1 if k not in res1]
    if missing1:
        print(f"FAILED (Interview): Missing keys {missing1}")
        print(f"Actual keys: {list(res1.keys())}")
    else:
        print("SUCCESS (Interview): All keys present.")
        print(f"Score: {res1.get('score')}")

    print("\n--- Verifying Test Evaluation ---")
    test_config = {"subject": "DSA", "topic": "Arrays", "difficulty": "Medium"}
    user_answers = {"0": 1}
    questions = [{"id": 1, "question": "Q1", "options": ["A", "B"], "correct_answer": 1}]
    res2 = client.evaluate_answers(test_config, user_answers, questions)
    keys2 = ["score", "feedback", "detailed_analysis"]
    missing2 = [k for k in keys2 if k not in res2]
    if missing2:
        print(f"FAILED (Test): Missing keys {missing2}")
        print(f"Actual keys: {list(res2.keys())}")
    else:
        print("SUCCESS (Test): All keys present.")
        print(f"Score: {res2.get('score')}")

if __name__ == "__main__":
    verify_structure()
