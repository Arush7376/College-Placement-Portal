from django.db import models
from django.conf import settings

class Job(models.Model):
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='posted_jobs',
        limit_choices_to={'role': 'RECRUITER'} # Assuming we want to enforce this at DB level or just trust app logic
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary_range = models.CharField(max_length=100, blank=True)
    requirements = models.TextField(blank=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

class MockInterviewResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    job_role = models.CharField(max_length=255)
    interview_type = models.CharField(max_length=100)
    score = models.IntegerField()
    summary = models.TextField()
    feedback = models.JSONField() # Key points
    strengths = models.JSONField()
    improvements = models.JSONField()
    answers = models.JSONField() # Full question/answer log
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.job_role} ({self.score}%)"
