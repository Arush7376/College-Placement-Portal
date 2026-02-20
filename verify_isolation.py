import requests
import json
import random

BASE_URL = "http://localhost:8000/api/auth"
PROGRESS_URL = "http://localhost:8000/api/auth/progress/"

def register_user(username, email, password):
    print(f"\nRegistering {username}...")
    url = f"{BASE_URL}/register/"
    data = {
        "username": username,
        "email": email,
        "password": password,
        "role": "STUDENT"
    }
    response = requests.post(url, json=data)
    if response.status_code == 201:
        print(f"✅ Registered {username}")
        return True
    elif "already exists" in response.text:
         print(f"ℹ️ {username} already exists")
         return True
    else:
        print(f"❌ Registration Failed: {response.text}")
        return False

def login_user(username, password):
    print(f"Logging in {username}...")
    url = f"{BASE_URL}/login/"
    data = {"username": username, "password": password}
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json()['access']
    print(f"❌ Login Failed: {response.text}")
    return None

def update_progress(token, username, scores):
    print(f"Updating progress for {username}: {scores}")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(PROGRESS_URL, json=scores, headers=headers)
    if response.status_code in [200, 201]:
        print(f"✅ Updated")
    else:
        print(f"❌ Update Failed: {response.text}")

def get_progress(token, username):
    print(f"Fetching progress for {username}...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(PROGRESS_URL, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"📄 Data: {data}")
        return data
    print(f"❌ Fetch Failed")
    return None

def test_isolation():
    # User 1
    u1 = "user_alpha"
    p1 = "pass123"
    register_user(u1, "alpha@test.com", p1)
    t1 = login_user(u1, p1)
    
    # User 2
    u2 = "user_beta"
    p2 = "pass123"
    register_user(u2, "beta@test.com", p2)
    t2 = login_user(u2, p2)

    if not t1 or not t2:
        return

    # Update User 1
    scores1 = {"dsa_progress": 10, "project_progress": 50}
    update_progress(t1, u1, scores1)

    # Update User 2 (Different scores)
    scores2 = {"dsa_progress": 90, "project_progress": 20}
    update_progress(t2, u2, scores2)

    # Verify User 1 sees ONLY User 1's scores
    d1 = get_progress(t1, u1)
    if d1['dsa_progress'] == 10 and d1['project_progress'] == 50:
        print("✅ User 1 Data Correct")
    else:
        print("❌ User 1 Data Mismatch")

    # Verify User 2 sees ONLY User 2's scores
    d2 = get_progress(t2, u2)
    if d2['dsa_progress'] == 90 and d2['project_progress'] == 20:
        print("✅ User 2 Data Correct")
    else:
        print("❌ User 2 Data Mismatch")

if __name__ == "__main__":
    test_isolation()
