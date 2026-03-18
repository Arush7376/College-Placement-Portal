import google.generativeai as genai
import sys
import traceback

def test():
    with open('gemini_debug_log.txt', 'w') as f:
        f.write("Starting Gemini Test...\n")
        try:
            api_key = "AIzaSyCgulhVs9T3NWIvvfSxEalnhNrLFKVXLJg"
            f.write(f"Using Key: {api_key[:10]}...\n")
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            f.write("Generating content...\n")
            response = model.generate_content("Say hello in one word")
            f.write(f"Response Text: {response.text}\n")
            f.write("SUCCESS\n")
        except Exception as e:
            f.write(f"FAILURE: {str(e)}\n")
            f.write(traceback.format_exc())
            f.write("\n")

if __name__ == "__main__":
    test()
