from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        STUDENT = "STUDENT", "Student"
        RECRUITER = "RECRUITER", "Recruiter"

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.STUDENT)

    def __str__(self):
        return f"{self.username} ({self.role})"

class StudentProgress(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='progress')
    dsa_progress = models.IntegerField(default=0)
    aptitude_progress = models.IntegerField(default=0)
    core_subjects_progress = models.IntegerField(default=0)
    project_progress = models.IntegerField(default=0)
    readiness_score = models.IntegerField(default=0)
    
    # Store recent test history as JSON or separate model? 
    # For simplicity, let's keep it simple for now or adding a JSONField if database supports it (SQLite does with latest Django versions or via specific field)
    # But to match mock data structure strictly, we might need a separate Relation or just calculate it.
    # For now, let's stick to the scores needed for the charts.
    
    def __str__(self):
        return f"Progress for {self.student.username}"
