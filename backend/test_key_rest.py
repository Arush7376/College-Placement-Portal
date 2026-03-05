import requests
import json

api_key = "AIzaSyCtPe6cRxjoL8nyMrAUOlmMIx7g0K0h1lI"
url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

payload = {
    "contents": [{"parts": [{"text": "Say hello in one word"}]}]
}

headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": api_key
}

print(f"Testing Gemini REST API...")
try:
    response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False)
    print(f"Status Code: {response.status_code}")
    try:
        res_json = response.json()
        print("Response JSON:")
        print(json.dumps(res_json, indent=2))
    except:
        print(f"Raw Content: {response.text}")
except Exception as e:
    print(f"ERROR: {str(e)}")
