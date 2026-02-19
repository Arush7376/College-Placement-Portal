from rest_framework import viewsets, permissions
from .models import Job
from .serializers import JobSerializer

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
