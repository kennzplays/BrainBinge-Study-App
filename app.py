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
        favorite_show = data.get('favorite_show', '')
        question_type = data.get('question_type', 'free')
        
        if not subject or not topic or not favorite_show:
            return jsonify({'error': 'Subject, topic, and favorite show are required'}), 400
        
        is_math = subject.lower() == 'math'
        
        latex_instruction = r"Use LaTeX notation wrapped in \( ... \) for mathematical expressions"
        language_instruction = latex_instruction if is_math else "Use clear, educational language"
        
        if question_type == 'mcq':
            question_format = "multiple-choice questions with options A, B, C, D for each, and indicate the correct answer"
            question_count = "5-7"
        else:
            question_format = "open-ended free response questions that require written explanation"
            question_count = "5-7"
        
        prompt = f"""You are an educational tutor that always relates concepts to the student's favorite show or anime.

Subject: {subject}
Topic: {topic}
Favorite show or anime: {favorite_show}
Question type: {question_type}
Mode: quiz_only

Generate {question_count} {question_format} about {topic} in {subject}. IMPORTANT: Always explain or ask questions by connecting the topic to the characters, world, themes, and events of {favorite_show}. Use training arcs, battles, character development, power systems, etc. as analogies and examples.

Instructions:
- {language_instruction}
- Make questions that relate the {topic} to {favorite_show} in creative and educational ways
- Include the correct answer for each question
- Format as JSON with this structure:
{{"questions": [{{"question": "...", "answer": "..."}}]}}

Make the questions challenging but appropriate for learners."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an educational quiz generator that relates all content to the student's favorite shows and anime. Always respond with valid JSON."},
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
        favorite_show = data.get('favorite_show', '')
        question_type = data.get('question_type', 'free')
        
        if not subject or not topic or not favorite_show:
            return jsonify({'error': 'Subject, topic, and favorite show are required'}), 400
        
        is_math = subject.lower() == 'math'
        
        latex_instruction = r"Use LaTeX notation wrapped in \( ... \) for mathematical expressions"
        language_instruction = latex_instruction if is_math else "Use clear, educational language"
        
        if question_type == 'mcq':
            question_format = "multiple-choice questions with options A, B, C, D for each, and indicate the correct answer"
        else:
            question_format = "open-ended free response questions that require written explanation"
        
        prompt = f"""You are an educational tutor that always relates concepts to the student's favorite show or anime.

Subject: {subject}
Topic: {topic}
Favorite show or anime: {favorite_show}
Question type: {question_type}
Mode: breakdown_quiz

Create a comprehensive breakdown and quiz for "{topic}" in {subject}. CRITICAL: You MUST relate ALL explanations to {favorite_show} by connecting the topic to characters, world, themes, battles, training arcs, power systems, character development, and events from the show.

Instructions:
1. First give a clear, step-by-step breakdown of the topic in these sections:
   - Introduction (brief overview that mentions {favorite_show})
   - Step-by-step explanation (main content broken into digestible parts, each using {favorite_show} as analogies)
   - Key points summary (bullet points connecting main takeaways to {favorite_show})

2. Then generate 3-5 {question_format} that test understanding while referencing {favorite_show}

- {language_instruction}
- Make connections to {favorite_show} natural and educational, not forced or confusing
- Use characters, plot points, and themes from {favorite_show} as teaching tools
- Format as JSON with this structure:
{{
  "introduction": "...",
  "explanation": ["step 1", "step 2", ...],
  "key_points": ["point 1", "point 2", ...],
  "questions": [{{"question": "...", "answer": "..."}}]
}}

Make it educational, engaging, and clearly connected to {favorite_show}."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an educational content creator that relates all content to the student's favorite shows and anime. Always respond with valid JSON."},
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
