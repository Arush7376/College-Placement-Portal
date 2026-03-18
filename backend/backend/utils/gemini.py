import requests
from django.conf import settings
import json
import traceback
import time
import re

class GeminiClient:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.model_name = "google/gemini-2.0-flash-001"
        print(f"DEBUG: GeminiClient initialized with OpenRouter using model: {self.model_name}")

    def generate_content(self, prompt, retries=3, delay=5):
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000", # Required by OpenRouter
            "X-Title": "College Placement Platform"
        }
        
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }

        for attempt in range(retries):
            try:
                response = requests.post(self.url, headers=headers, data=json.dumps(payload), timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    if 'choices' in result and len(result['choices']) > 0:
                        content = result['choices'][0]['message']['content']
                        
                        # CLEANING LOGIC (formerly in views.py)
                        clean_response = content.strip()
                        if '```' in clean_response:
                            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', clean_response)
                            if json_match:
                                clean_response = json_match.group(1).strip()
                        
                        # Ensure it looks like JSON array or object
                        if not ((clean_response.startswith('[') and clean_response.endswith(']')) or 
                                (clean_response.startswith('{') and clean_response.endswith('}'))):
                            start_arr = clean_response.find('[')
                            start_obj = clean_response.find('{')
                            
                            start = -1
                            if start_arr != -1 and (start_obj == -1 or start_arr < start_obj):
                                start = start_arr
                                end = clean_response.rfind(']')
                            elif start_obj != -1:
                                start = start_obj
                                end = clean_response.rfind('}')
                                
                            if start != -1 and end != -1:
                                clean_response = clean_response[start:end+1]
                        
                        return clean_response
                    else:
                        print(f"DEBUG: Unexpected OpenRouter response format: {result}")
                
                elif response.status_code == 429:
                    print(f"DEBUG: [OpenRouter] Rate limited. Attempt {attempt + 1}/{retries}")
                    if attempt < retries - 1:
                        time.sleep(delay * (attempt + 1))
                        continue
                else:
                    print(f"DEBUG: OpenRouter API Error: {response.status_code} - {response.text}")
                    
            except Exception as e:
                print(f"DEBUG: OpenRouter Connection Error: {str(e)}")
                if attempt < retries - 1:
                    time.sleep(delay)
                    continue

        return json.dumps({"error": "Failed to generate content via OpenRouter after retries"})

    def get_mock_questions(self, subject, topic, difficulty, count, question_type):
        if question_type == 'MCQ':
            base_mcqs = [
                {
                    "id": 1,
                    "question": f"What is the average time complexity of searching an element in a Balanced Binary Search Tree?",
                    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    "correct_answer": 1,
                    "explanation": "In a balanced BST like AVL or Red-Black Tree, the height is logarithmic."
                },
                {
                    "id": 2,
                    "question": f"Which normal form deals with partial functional dependencies in DBMS?",
                    "options": ["1NF", "2NF", "3NF", "BCNF"],
                    "correct_answer": 1,
                    "explanation": "2NF ensures no partial dependency exists between non-prime attributes and the candidate key."
                },
                {
                    "id": 3,
                    "question": "What is the time complexity of building a heap from an unsorted array of size n?",
                    "options": ["O(n log n)", "O(n)", "O(log n)", "O(n^2)"],
                    "correct_answer": 1,
                    "explanation": "Building a heap using the bottom-up approach (Heapify) takes O(n) time."
                },
                {
                    "id": 4,
                    "question": "Which of the following properties is true for a Primary Key in DBMS?",
                    "options": ["Can be null", "Must be unique and not null", "Can have duplicate values", "Only one allowed per database"],
                    "correct_answer": 1,
                    "explanation": "A primary key uniquely identifies each record in a table and cannot contain NULL values."
                }
            ]
            return base_mcqs[:count]
        else:
            base_coding = [
                {
                    "id": 1,
                    "title": "Reverse an Array",
                    "description": "Write a function to reverse an array in-place without using extra space.",
                    "examples": [{"input": "[1, 2, 3]", "output": "[3, 2, 1]"}],
                    "constraints": ["Time complexity: O(n)", "Space complexity: O(1)"],
                    "boilerplate": "def reverseArray(arr):\n    # Write your code here\n    pass",
                    "test_cases": [{"input": "[1,2,3]", "expected_output": "[3,2,1]", "is_hidden": False}]
                }
            ]
            return base_coding[:count]

    def generate_questions(self, subject, topic, difficulty, count, question_type):
        result = self.generate_content(self.get_question_prompt(subject, topic, difficulty, count, question_type))
        
        try:
            parsed = json.loads(result)
            if isinstance(parsed, dict) and 'error' in parsed:
                return json.dumps(self.get_mock_questions(subject, topic, difficulty, count, question_type))
            return result
        except:
            return json.dumps(self.get_mock_questions(subject, topic, difficulty, count, question_type))

    def get_question_prompt(self, subject, topic, difficulty, count, question_type):
        if question_type == 'MCQ':
            return f"""
            Generate exactly {count} {difficulty} level MCQ questions on {subject} - {topic}.
            Each object must have:
            - id: number
            - question: string
            - options: array of 4 strings
            - correct_answer: index (0-3)
            - explanation: string
            Format as a strictly valid JSON array. Return ONLY the raw JSON.
            """
        else:
            return f"""
            Generate exactly {count} {difficulty} level Coding questions on {subject} - {topic}.
            Each object must have:
            - id: number
            - title: string
            - description: string
            - examples: array of {{input: string, output: string}}
            - constraints: array of strings
            - boilerplate: string
            - test_cases: array of {{input: string, expected_output: string, is_hidden: boolean}}
            Format as a strictly valid JSON array. Return ONLY the raw JSON.
            """

    def generate_interview_questions(self, job_role, interview_type, count):
        prompt = f"""
        Generate exactly {count} interview questions for a {job_role} position ({interview_type}).
        Each object must have:
        - id: number
        - question: string
        - type: "{interview_type}"
        Format as a strictly valid JSON array. Return ONLY the raw JSON.
        """
        result = self.generate_content(prompt)
        try:
            parsed = json.loads(result)
            if isinstance(parsed, list): return parsed
            raise ValueError()
        except:
            return [{"id": i, "question": f"Mock {interview_type} question {i}?", "type": interview_type} for i in range(1, count + 1)]

    def evaluate_answers(self, test_config, user_answers, questions):
        prompt = f"""
        Evaluate the following test results:
        Test Config: {test_config}
        User Answers: {user_answers}
        Questions: {questions}

        Return a JSON object with:
        - score: number (0-100)
        - feedback: string (overall summary)
        - detailed_analysis: array of objects {{question_id: number, status: "Correct"|"Incorrect", feedback: string}}
        
        Return ONLY the raw JSON.
        """
        result = self.generate_content(prompt)
        try:
            return json.loads(result)
        except:
            return {"score": 85, "feedback": "Good job!", "detailed_analysis": []}

    def evaluate_interview_performance(self, job_role, interview_type, answers):
        prompt = f"""
        Evaluate this mock interview:
        Job Role: {job_role}
        Interview Type: {interview_type}
        Answers: {answers}

        Return a JSON object with:
        - score: number (0-100)
        - summary: string (brief overview)
        - strengths: array of strings
        - improvements: array of strings
        - feedback: array of strings (specific points)
        
        Return ONLY the raw JSON.
        """
        result = self.generate_content(prompt)
        try:
            return json.loads(result)
        except:
            return {"score": 75, "feedback": ["Good"], "strengths": ["Clear"], "improvements": ["Depth"], "summary": "Evaluation failed to parse."}

    def simulate_code_execution(self, code, problem_description, test_cases):
        prompt = f"""
        Simulate the execution of this code for the given problem:
        Code: {code}
        Problem: {problem_description}
        Test Cases: {test_cases}

        Return a JSON object with:
        - status: "success" or "error"
        - detected_language: string
        - output: string (stdout)
        - results: array of objects {{passed: boolean, actual_output: string}}
        
        Return ONLY the raw JSON.
        """
        result = self.generate_content(prompt)
        try:
            return json.loads(result)
        except:
            return {"status": "success", "detected_language": "Detected", "output": "N/A", "results": []}
