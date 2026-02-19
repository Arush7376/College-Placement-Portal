from django.db import models
from django.conf import settings
from jobs.models import Job

class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'APPLIED', 'Applied'
        SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
        INTERVIEW = 'INTERVIEW', 'Interview'
        SELECTED = 'SELECTED', 'Selected'
        REJECTED = 'REJECTED', 'Rejected'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='applications',
        limit_choices_to={'role': 'STUDENT'}
    )
    job = models.ForeignKey(
        Job, 
        on_delete=models.CASCADE, 
        related_name='applications'
    )
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.APPLIED
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'job')

    def __str__(self):
        return f"{self.student} -> {self.job}"
