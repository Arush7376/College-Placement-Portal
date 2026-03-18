from rest_framework import serializers
from .models import Job, MockInterviewResult

class JobSerializer(serializers.ModelSerializer):
    recruiter = serializers.ReadOnlyField(source='recruiter.username')
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('recruiter', 'posted_at')

class MockInterviewResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockInterviewResult
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
