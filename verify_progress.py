import requests
import json

BASE_URL = "http://localhost:8000/api/auth"
PROGRESS_URL = "http://localhost:8000/api/auth/progress/"

def get_auth_token():
    print("Logging in to get token...")
    url = f"{BASE_URL}/login/"
    data = {
        "username": "api_test_user", 
        "password": "testpassword123"
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()['access']
        else:
            print(f"❌ Login Failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return None

def test_get_progress(token):
    print("\nTesting GET Progress...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(PROGRESS_URL, headers=headers)
    if response.status_code == 200:
        print(f"✅ GET Success: {response.json()}")
        return True
    elif response.status_code == 404:
        print("ℹ️ Progress not found (Expected for new user)")
        return True
    else:
        print(f"❌ GET Failed: {response.status_code} - {response.text}")
        return False

def test_update_progress(token):
    print("\nTesting POST/PUT Progress...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "dsa_progress": 45,
        "aptitude_progress": 60,
        "core_subjects_progress": 75,
        "project_progress": 30,
        "readiness_score": 55
    }
    # Try POST first (create)
    response = requests.post(PROGRESS_URL, json=data, headers=headers)
    if response.status_code == 201:
         print(f"✅ POST Success: {response.json()}")
    elif response.status_code == 200: # Maybe we use same endpoint for update
         print(f"✅ POST/PUT Success: {response.json()}")
    else:
        print(f"❌ POST Failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    token = get_auth_token()
    if token:
        test_get_progress(token)
        test_update_progress(token)
        test_get_progress(token) # Verify update
