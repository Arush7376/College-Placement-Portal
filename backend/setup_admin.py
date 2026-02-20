import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

if User.objects.filter(is_superuser=True).exists():
    print("Superuser exists.")
    for u in User.objects.filter(is_superuser=True):
        print(f"Username: {u.username}")
else:
    print("No superuser found. Creating one...")
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print("Superuser 'admin' created with password 'admin'")
