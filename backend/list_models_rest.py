import requests
import json

api_key = "AIzaSyCtPe6cRxjoL8nyMrAUOlmMIx7g0K0h1lI"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

print(f"Listing models via REST (ignoring SSL)...")
try:
    response = requests.get(url, verify=False)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        models = response.json()
        for m in models.get('models', []):
            print(f"- {m['name']} ({', '.join(m.get('supportedGenerationMethods', []))})")
    else:
        print(f"FAILURE: {response.text}")
except Exception as e:
    print(f"ERROR: {str(e)}")
