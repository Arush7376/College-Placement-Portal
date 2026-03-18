import os
import sys
import django

# Setup Django environment
sys.path.append(r'c:\college-placement-platform\College-Placement-Portal\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.utils.gemini import GeminiClient

def test_evaluation():
    client = GeminiClient()
    
    # Test Interview Evaluation
    print("Testing Interview Evaluation...")
    interview_answers = [
        {"question": "Tell me about yourself.", "answer": "I am a software engineer with 5 years of experience in React and Python."},
        {"question": "How do you handle conflict?", "answer": "I try to understand the root cause and talk it out professionally."}
    ]
    interview_result = client.evaluate_interview_performance("Software Engineer", "Technical", interview_answers)
    print(f"Interview Result: {interview_result}")
    
    # Test Test Evaluation
    print("\nTesting Test Evaluation...")
    test_config = {"subject": "DSA", "topic": "Arrays", "difficulty": "Medium"}
    user_answers = {"0": 1} # Assuming first question, index 1 is correct
    questions = [
        {"id": 1, "question": "Complexity of binary search?", "options": ["O(1)", "O(log n)", "O(n)"], "correct_answer": 1}
    ]
    test_result = client.evaluate_answers(test_config, user_answers, questions)
    print(f"Test Result: {test_result}")

if __name__ == "__main__":
    test_evaluation()
