
import requests
import json
import time

def test_api():
    url = 'http://127.0.0.1:8000/api/gemini/'
    
    payload = {
        "action": "generate_questions",
        "subject": "DSA",
        "topic": "Arrays",
        "difficulty": "Easy",
        "count": 2,
        "type": "MCQ"
    }
    
    headers = {
        "Content-Type": "application/json"
    }

    print(f"Sending POST request to {url}...")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        start_time = time.time()
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        end_time = time.time()
        
        print(f"Status Code: {response.status_code}")
        print(f"Time Taken: {end_time - start_time:.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            print("SUCCESS: Received verified JSON response.")
            print(f"Response Keys: {data.keys()}")
            if 'questions' in data:
                 print(f"Questions Raw (first 100 chars): {str(data['questions'])[:100]}...")
        else:
            print(f"FAILURE: Server returned {response.status_code}")
            # Save error to file
            with open('error_response.html', 'w', encoding='utf-8') as f:
                f.write(response.text)
            print("Error saved to error_response.html")

    except Exception as e:
        print(f"ERROR: Request failed - {str(e)}")

if __name__ == "__main__":
    test_api()
