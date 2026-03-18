from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils.gemini import GeminiClient
from rest_framework.permissions import AllowAny
import json

class GeminiView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            action = request.data.get('action')
            client = GeminiClient()
            
            if action == 'generate_questions':
                subject = request.data.get('subject')
                topic = request.data.get('topic')
                difficulty = request.data.get('difficulty')
                count = request.data.get('count', 10)
                question_type = request.data.get('type', 'MCQ')
                
                response_text = client.generate_questions(subject, topic, difficulty, count, question_type)
                
                try:
                    parsed_json = json.loads(response_text)
                    
                    if isinstance(parsed_json, dict) and 'error' in parsed_json:
                        return Response({
                            "error": f"AI Error: {parsed_json['error']}",
                            "raw_response": response_text
                        }, status=status.HTTP_400_BAD_REQUEST)
    
                    if isinstance(parsed_json, dict) and 'questions' in parsed_json and isinstance(parsed_json['questions'], list):
                        parsed_json = parsed_json['questions']
                    
                    if not isinstance(parsed_json, list):
                         return Response({
                            "error": "AI returned an object instead of a list of questions.",
                            "raw_response": response_text
                        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    
                    return Response({"questions": parsed_json}, status=status.HTTP_200_OK)
                    
                except Exception as e:
                    print(f"ERROR: Failed to parse Gemini response: {e}")
                    return Response({
                        "error": f"Parsing Error: {str(e)}",
                        "raw_response": response_text
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            elif action == 'evaluate':
                test_config = request.data.get('testConfig')
                user_answers = request.data.get('userAnswers')
                questions = request.data.get('questions')
                
                evaluation = client.evaluate_answers(test_config, user_answers, questions)
                return Response({"evaluation": evaluation}, status=status.HTTP_200_OK)
    
            prompt = request.data.get('prompt')
            if prompt:
                response_text = client.generate_content(prompt)
                return Response({"response": response_text}, status=status.HTTP_200_OK)
                
            return Response({"error": f"Invalid action ({action}) or missing prompt"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": f"Unexpected Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
