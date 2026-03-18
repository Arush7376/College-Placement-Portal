import google.generativeai as genai
import os
import sys

# Try to get key from settings or env
api_key = "AIzaSyCtPe6cRxjoL8nyMrAUOlmMIx7g0K0h1lI"

print(f"Testing Key: {api_key[:10]}...")

try:
    genai.configure(api_key=api_key, transport='rest')
    
    print("Available Models:")
    # genai.list_models() might still use gRPC by default if not careful, 
    # but configure(transport='rest') should cover it for the model.
            
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say hello in one word")
    print(f"SUCCESS (1.5-flash): {response.text}")
    
except Exception as e:
    print(f"FAILURE: {str(e)}")
