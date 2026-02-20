import google.generativeai as genai
from django.conf import settings

class GeminiClient:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_content(self, prompt):
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            # Return a JSON-safe error string
            return f'{{"error": "{str(e).replace('"', "'")}"}}'

    def generate_questions(self, subject, topic, difficulty, count, question_type):
        prompt = f"""
        Generate {count} {difficulty} level {question_type} questions on {subject} - {topic}.
        
        Ensure the questions are relevant for technical interviews and cover key concepts.
        Provide clear and concise explanations for the correct answers to help students prepare.

        Format the output as a strictly valid JSON array of objects. 
        Do not allow any markdown formatting or code blocks in the output.
        The output should be raw JSON.

        If question_type is 'MCQ', each object should have:
        - id: number
        - question: string
        - options: array of 4 strings
        - correct_answer: index (0-3) or string matching one option accurately
        - explanation: string (detailed explanation of why the answer is correct)

        If question_type is 'Coding', each object should have:
        - id: number
        - title: string
        - description: string (problem statement with context)
        - examples: array of objects {{input: string, output: string}}
        - constraints: array of strings
        """
        return self.generate_content(prompt)

    def evaluate_answers(self, test_config, user_answers, questions):
        prompt = f"""
        Evaluate the following student submission for a {test_config.get('subject')} test.
        
        Test Config: {test_config}
        Questions: {questions}
        User Answers: {user_answers}

        Provide a JSON object with:
        - score: number (0-100)
        - feedback: string (overall feedback)
        - detailed_analysis: array of objects {{question_id: number, status: 'Correct'/'Incorrect', feedback: string}}
        
        Be strict but constructive.
        """
        return self.generate_content(prompt)
