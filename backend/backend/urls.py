from django.contrib import admin
from django.urls import path, include
from .views import GeminiView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('jobs.urls')),
    path('api/', include('applications.urls')),
    path('api/gemini/', GeminiView.as_view(), name='gemini'),
]
