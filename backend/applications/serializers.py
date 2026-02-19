from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    student = serializers.ReadOnlyField(source='student.username')
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company_name')

    class Meta:
        model = Application
        fields = '__all__'
