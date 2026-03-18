import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

def test_register():
    print("Testing Registration...")
    url = f"{BASE_URL}/register/"
    data = {
        "username": "api_test_user",
        "email": "apitest@example.com",
        "password": "testpassword123",
        "role": "STUDENT"
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print("✅ Registration Successful")
            return True
        elif response.status_code == 400 and "username" in response.json() and "already exists" in str(response.json()):
             print("✅ User already exists (Registration working)")
             return True
        else:
            print(f"❌ Registration Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return False

def test_login():
    print("\nTesting Login...")
    url = f"{BASE_URL}/login/"
    # Note: SimpleJWT usually expects 'username' and 'password'
    # Our react app sends 'username' (which is email) because we mapped it in api.js,
    # but let's check what the backend actually expects. 
    # Standard SimpleJWT expects 'username'.
    data = {
        "username": "api_test_user", 
        "password": "testpassword123"
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("✅ Login Successful")
            tokens = response.json()
            print(f"   Access Token: {tokens['access'][:20]}...")
            return tokens['access']
        else:
            print(f"❌ Login Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return False

if __name__ == "__main__":
    if test_register():
        test_login()
