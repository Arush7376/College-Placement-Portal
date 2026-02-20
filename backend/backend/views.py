from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils.gemini import GeminiClient
from rest_framework.permissions import AllowAny

class GeminiView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print("DEBUG: GeminiView POST called")
        print(f"DEBUG: Request Data: {request.data}")
        action = request.data.get('action')
        client = GeminiClient()
        
        if action == 'generate_questions':
            print("DEBUG: Generating questions...")
            subject = request.data.get('subject')
            topic = request.data.get('topic')
            difficulty = request.data.get('difficulty')
            count = request.data.get('count', 10)
            question_type = request.data.get('type', 'MCQ')
            
            response_text = client.generate_questions(subject, topic, difficulty, count, question_type)
            print(f"DEBUG: Gemini Response for {subject}: {response_text[:200]}...") # Log first 200 chars
            
            # Clean up response if it contains markdown code blocks
            clean_response = response_text.replace('```json', '').replace('```', '').strip()
            # Handle potential leading/trailing non-json characters if Gemini is chatty
            if clean_response.startswith('json'): 
                clean_response = clean_response[4:].strip()
            
            return Response({"questions": clean_response}, status=status.HTTP_200_OK)
            
        elif action == 'evaluate':
            test_config = request.data.get('testConfig')
            user_answers = request.data.get('userAnswers')
            questions = request.data.get('questions')
            
            response_text = client.evaluate_answers(test_config, user_answers, questions)
            clean_response = response_text.replace('```json', '').replace('```', '').strip()
            if clean_response.startswith('json'): 
                clean_response = clean_response[4:].strip()
            
            return Response({"evaluation": clean_response}, status=status.HTTP_200_OK)

        # Fallback for generic prompt
        prompt = request.data.get('prompt')
        if prompt:
            response_text = client.generate_content(prompt)
            return Response({"response": response_text}, status=status.HTTP_200_OK)
            
        return Response({"error": "Invalid action or missing prompt"}, status=status.HTTP_400_BAD_REQUEST)
