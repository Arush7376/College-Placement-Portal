from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JobViewSet, 
    generate_interview_questions_view, 
    evaluate_interview_view, 
    run_code_view,
    get_user_interviews_view
)

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')

urlpatterns = [
    path('', include(router.urls)),
    path('interview-questions/', generate_interview_questions_view, name='interview-questions'),
    path('evaluate-interview/', evaluate_interview_view, name='evaluate-interview'),
    path('past-interviews/', get_user_interviews_view, name='past-interviews'),
    path('run-code/', run_code_view, name='run-code'),
]
