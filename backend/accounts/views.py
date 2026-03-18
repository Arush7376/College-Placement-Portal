from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, StudentProgressSerializer
from .models import StudentProgress

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StudentProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        progress, created = StudentProgress.objects.get_or_create(student=request.user)
        serializer = StudentProgressSerializer(progress)
        return Response(serializer.data)

    def post(self, request):
        progress, created = StudentProgress.objects.get_or_create(student=request.user)
        serializer = StudentProgressSerializer(progress, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
