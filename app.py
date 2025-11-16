from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
import json

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
            question_count = "5-7"
            prompt = f"""You are an educational tutor that always relates concepts to the student's favorite show or anime.

Subject: {subject}
Topic: {topic}
Favorite show or anime: {favorite_show}
Mode: quiz_only

Generate {question_count} multiple-choice questions about {topic} in {subject}. CRITICAL: Connect every question to {favorite_show} using its characters, world, themes, battles, or power systems.

Instructions:
- {language_instruction}
- Each question must reference {favorite_show} in a clear, educational way
- Format as JSON with this structure:
{{
  "questions": [
    {{
      "type": "mcq",
      "question": "Question text relating to {favorite_show}...",
      "options": {{
        "A": "First option text",
        "B": "Second option text",
        "C": "Third option text",
        "D": "Fourth option text"
      }},
      "correct_option": "B",
      "explanation_correct": "Why this answer is right, using {favorite_show} references...",
      "explanation_incorrect": "Why wrong answers are wrong, relating to {favorite_show}..."
    }}
  ]
}}

Make questions challenging but appropriate for learners."""
        
        elif question_type == 'mixed':
            prompt = f"""You are an educational tutor that always relates concepts to the student's favorite show or anime.

Subject: {subject}
Topic: {topic}
Favorite show or anime: {favorite_show}
Mode: quiz_only

Generate 6-8 questions (mix of multiple-choice and free response) about {topic} in {subject}. CRITICAL: Connect every question to {favorite_show}.

Instructions:
- {language_instruction}
- Include both MCQ (with 4 options A-D) and free response questions
- Each question must reference {favorite_show}
- Format as JSON:
{{
  "questions": [
    {{
      "type": "mcq",
      "question": "MCQ question relating to {favorite_show}...",
      "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
      "correct_option": "A",
      "explanation_correct": "Explanation using {favorite_show}...",
      "explanation_incorrect": "Why wrong answers fail, using {favorite_show}..."
    }},
    {{
      "type": "free",
      "question": "Free response question about {topic} relating to {favorite_show}...",
      "answer": "Model answer connecting {topic} to {favorite_show}..."
    }}
  ]
}}"""
        
        else:
            prompt = f"""You are an educational tutor that always relates concepts to the student's favorite show or anime.

Subject: {subject}
Topic: {topic}
Favorite show or anime: {favorite_show}
Mode: quiz_only

Generate 5-7 free response questions about {topic} in {subject}. CRITICAL: Connect every question to {favorite_show}.

Instructions:
- {language_instruction}
- Each question must reference {favorite_show}
- Format as JSON:
{{
  "questions": [
    {{
      "type": "free",
      "question": "Question relating to {favorite_show}...",
      "answer": "Model answer connecting concepts to {favorite_show}..."
    }}
  ]
}}"""

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
            questions_format = """
  "questions": [
    {{
      "type": "mcq",
      "question": "Question relating to {favorite_show}...",
      "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
      "correct_option": "A",
      "explanation_correct": "Why correct, using {favorite_show}...",
      "explanation_incorrect": "Why wrong, using {favorite_show}..."
    }}
  ]"""
        elif question_type == 'mixed':
            questions_format = """
  "questions": [
    {{
      "type": "mcq",
      "question": "MCQ question...",
      "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
      "correct_option": "A",
      "explanation_correct": "...",
      "explanation_incorrect": "..."
    }},
    {{
      "type": "free",
      "question": "Free response question...",
      "answer": "Model answer..."
    }}
  ]"""
        else:
            questions_format = """
  "questions": [
    {{
      "type": "free",
      "question": "Question...",
      "answer": "Model answer..."
    }}
  ]"""
        
        prompt = f"""You are an educational tutor that always relates concepts to the student's favorite show or anime.

Subject: {subject}
Topic: {topic}
Favorite show or anime: {favorite_show}
Mode: breakdown_quiz

Create a comprehensive breakdown and quiz for "{topic}" in {subject}. CRITICAL: Relate ALL content to {favorite_show}.

Instructions:
1. Breakdown with these sections:
   - Introduction: Brief overview mentioning {favorite_show}
   - Explanation: Step-by-step using {favorite_show} analogies
   - Key points: Bullet points connecting to {favorite_show}

2. Then generate 3-5 questions based on question type

- {language_instruction}
- Make {favorite_show} connections natural and educational
- Use characters, plot points, themes as teaching tools
- Format as JSON:
{{
  "introduction": "...",
  "explanation": ["step 1", "step 2", ...],
  "key_points": ["point 1", "point 2", ...],
{questions_format}
}}"""

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

@app.route('/grade_free_response', methods=['POST'])
def grade_free_response():
    try:
        data = request.json
        question_text = data.get('question', '')
        model_answer = data.get('model_answer', '')
        user_answer = data.get('user_answer', '')
        
        if not question_text or not model_answer or not user_answer:
            return jsonify({'error': 'Question, model answer, and user answer are required'}), 400
        
        prompt = f"""You are grading a short free-response answer.
Question: {question_text}
Correct answer: {model_answer}
Student answer: {user_answer}

Compare the student answer with the correct answer.
1. Give a similarity score from 0 to 100, where 100 means essentially identical in meaning.
2. Then say whether the student answer is correct or incorrect using this rule:
   - If similarity >= 80 → correct
   - If similarity < 80 → incorrect

Respond in strict JSON ONLY with:
{{
  "score": <number 0-100>,
  "is_correct": true/false,
  "feedback": "<short explanation for why it is correct or incorrect>"
}}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a grading assistant. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        
        if not result:
            return jsonify({'error': 'No response from grading model'}), 500
        
        grading = json.loads(result)
        score = grading.get('score', 0)
        grading['is_correct'] = score >= 80
        
        return jsonify({'success': True, 'data': json.dumps(grading)})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
