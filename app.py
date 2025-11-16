from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

AI_INTEGRATIONS_OPENAI_API_KEY = os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY")
AI_INTEGRATIONS_OPENAI_BASE_URL = os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")

client = OpenAI(
    api_key=AI_INTEGRATIONS_OPENAI_API_KEY,
    base_url=AI_INTEGRATIONS_OPENAI_BASE_URL
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    try:
        data = request.json
        subject = data.get('subject', '')
        topic = data.get('topic', '')
        
        if not subject or not topic:
            return jsonify({'error': 'Subject and topic are required'}), 400
        
        is_math = subject.lower() == 'math'
        
        latex_instruction = r"Use LaTeX notation wrapped in \( ... \) for mathematical expressions"
        language_instruction = latex_instruction if is_math else "Use clear, educational language"
        
        prompt = f"""Generate 5-7 quiz questions about {topic} in the subject of {subject}.

Instructions:
- Create diverse question types (multiple choice, true/false, short answer)
- Include the correct answer for each question
- {language_instruction}
- Format as JSON with this structure:
{{"questions": [{{"question": "...", "answer": "...", "type": "multiple_choice|true_false|short_answer"}}]}}

Make the questions challenging but appropriate for learners."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an educational quiz generator. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        
        return jsonify({'success': True, 'data': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/breakdown_quiz', methods=['POST'])
def breakdown_quiz():
    try:
        data = request.json
        subject = data.get('subject', '')
        topic = data.get('topic', '')
        
        if not subject or not topic:
            return jsonify({'error': 'Subject and topic are required'}), 400
        
        is_math = subject.lower() == 'math'
        
        latex_instruction = r"Use LaTeX notation wrapped in \( ... \) for mathematical expressions"
        language_instruction = latex_instruction if is_math else "Use clear, educational language"
        
        prompt = f"""Create a comprehensive breakdown and quiz for the topic "{topic}" in {subject}.

Instructions:
- Provide a clear, structured breakdown with these sections:
  1. Introduction (brief overview)
  2. Step-by-step explanation (main content broken into digestible parts)
  3. Key points summary (bullet points of main takeaways)
- After the breakdown, generate 3-5 quiz questions to test understanding
- {language_instruction}
- Format as JSON with this structure:
{{
  "introduction": "...",
  "explanation": ["step 1", "step 2", ...],
  "key_points": ["point 1", "point 2", ...],
  "questions": [{{"question": "...", "answer": "..."}}]
}}

Make it educational and engaging."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an educational content creator. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        
        return jsonify({'success': True, 'data': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
