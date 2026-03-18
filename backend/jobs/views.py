from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Job, MockInterviewResult
from .serializers import JobSerializer, MockInterviewResultSerializer
from backend.utils.gemini import GeminiClient

class IsRecruiterOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'RECRUITER'

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-posted_at')
    serializer_class = JobSerializer
    permission_classes = [IsRecruiterOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_interview_questions_view(request):
    job_role = request.data.get('job_role')
    interview_type = request.data.get('interview_type')
    count = request.data.get('count', 5)
    
    if not job_role or not interview_type:
        return Response({'error': 'job_role and interview_type are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    client = GeminiClient()
    questions = client.generate_interview_questions(job_role, interview_type, count)
    return Response(questions)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def evaluate_interview_view(request):
    job_role = request.data.get('job_role')
    interview_type = request.data.get('interview_type')
    answers = request.data.get('answers')
    
    if not job_role or not interview_type or not answers:
        return Response({'error': 'job_role, interview_type, and answers are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    client = GeminiClient()
    evaluation = client.evaluate_interview_performance(job_role, interview_type, answers)
    
    # Save to database locally
    try:
        from .models import MockInterviewResult
        MockInterviewResult.objects.create(
            user=request.user,
            job_role=job_role,
            interview_type=interview_type,
            score=evaluation.get('score', 0),
            summary=evaluation.get('summary', ''),
            feedback=evaluation.get('feedback', []),
            strengths=evaluation.get('strengths', []),
            improvements=evaluation.get('improvements', []),
            answers=answers
        )
    except Exception as e:
        print(f"Error saving interview result: {str(e)}")

    return Response(evaluation)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def run_code_view(request):
    code = request.data.get('code')
    problem_description = request.data.get('problem_description')
    test_cases = request.data.get('test_cases', [])
    
    if not code or not problem_description:
        return Response({'error': 'code and problem_description are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    client = GeminiClient()
    result = client.simulate_code_execution(code, problem_description, test_cases)
    return Response(result)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_interviews_view(request):
    results = MockInterviewResult.objects.filter(user=request.user).order_by('-created_at')
    serializer = MockInterviewResultSerializer(results, many=True)
    return Response(serializer.data)
