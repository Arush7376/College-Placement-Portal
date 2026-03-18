from rest_framework import viewsets, permissions
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT':
            return Application.objects.filter(student=user)
        elif user.role == 'RECRUITER':
            return Application.objects.filter(job__recruiter=user)
        return Application.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
