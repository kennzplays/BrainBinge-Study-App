# BrainBinge - Study & Quiz Web App

## Overview
BrainBinge is a gamified study and quiz web application that uses AI to generate educational content **related to the user's favorite show or anime**. Users select subjects, describe topics they want to learn, enter their favorite show, choose question type, and receive AI-generated quiz questions or comprehensive topic breakdowns that connect the learning material to their favorite show.

**Unique Feature**: All content includes **interactive answer checking** where users can click MCQ options or check free response answers, receiving instant feedback with explanations themed around their favorite show.

## Current State
Fully functional MVP with all core features implemented, including interactive quiz functionality with dynamic XP rewards. Running on Flask server (port 5000).

## Recent Changes (November 16, 2025)
- **Latest Major Update**: Added AI-based free response grading system
  - Free response answers now graded using AI similarity checking (0-100 score)
  - 80% threshold: >=80 = correct (15 XP), <80 = incorrect (5 XP)
  - Shows similarity score, AI feedback, and suggested answer
  - XP rewards now match MCQ system for consistency
  - Server-side threshold validation for security
  
- **Previous Updates**: 
  - Added interactive answer checking system
  - MCQ questions display as clickable A/B/C/D buttons with instant feedback
  - Changed question type selection from radio buttons to dropdown
  - Added support for "mixed" question type (both MCQ and free response)
  - Added subtitle: "Turn any topic into a lesson based on your favorite shows and anime"
  - Added favorite show/anime integration with themed explanations

## Tech Stack
- **Backend**: Python 3.11 + Flask 3.0.0
- **AI**: OpenAI via Replit AI Integrations (gpt-4o-mini)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Math Rendering**: MathJax 3 (CDN)

## Project Structure
```
/
├── app.py                  # Flask server with API endpoints
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html         # Main HTML template with interactive UI
├── static/
│   ├── style.css          # Blue/white themed styling + interactive elements
│   └── script.js          # Frontend logic, XP system, and answer checking
└── replit.md              # This file
```

## Features
1. **Subject Selection**: 5 preset subjects + custom subject input
2. **Favorite Show Integration**: All content relates to user's chosen show/anime
3. **Question Type Selection** (Dropdown): 
   - Free Response Only
   - Multiple Choice (A/B/C/D) Only
   - Mix of Both
4. **Interactive Answer Checking**:
   - **MCQ**: Click A/B/C/D buttons, get instant feedback with show-themed explanations
   - **Free Response**: AI-graded similarity checking with 0-100 score
     - Shows AI feedback, similarity score, and suggested answer
     - 80% threshold for correctness
   - Consistent XP rewards: 15 XP correct, 5 XP incorrect
5. **Two Generation Modes**:
   - **Quiz Questions**: Generates 5-7 interactive questions
   - **Breakdown + Quiz**: Structured explanation + 3-5 interactive practice questions
6. **Dynamic XP System**: 
   - Correct answers (MCQ or Free Response): +15 XP
   - Incorrect answers (MCQ or Free Response): +5 XP
   - Persistent storage via localStorage
   - Level progression (50 XP per level)
7. **Level Titles**:
   - Level 1: Brain Rookie
   - Level 2: Study Starter
   - Level 3: Quiz Grinder
   - Level 4+: Brain Binger
8. **LaTeX Support**: MathJax rendering for mathematical expressions
9. **Responsive Design**: Works on various screen sizes

## API Endpoints
- `GET /` - Main application page
- `POST /generate_quiz` - Generate interactive quiz questions
  - Params: `subject`, `topic`, `favorite_show`, `question_type`
  - Returns: Questions with type, options (MCQ), explanations
- `POST /breakdown_quiz` - Generate topic breakdown with interactive quiz
  - Params: `subject`, `topic`, `favorite_show`, `question_type`
  - Returns: Breakdown + interactive questions
- `POST /grade_free_response` - AI-grade free response answers
  - Params: `question`, `model_answer`, `user_answer`
  - Returns: `score` (0-100), `is_correct` (boolean), `feedback` (explanation)

## Question Format
### MCQ Questions
```json
{
  "type": "mcq",
  "question": "Question text...",
  "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
  "correct_option": "B",
  "explanation_correct": "Why this is right...",
  "explanation_incorrect": "Why wrong answers fail..."
}
```

### Free Response Questions
```json
{
  "type": "free",
  "question": "Question text...",
  "answer": "Model answer..."
}
```

## How It Works
1. User enters subject, topic, and favorite show/anime
2. AI generates questions that connect the topic to the show (characters, plot, themes, etc.)
3. User interacts with questions:
   - **MCQ**: Click answer options → instant feedback + XP
   - **Free Response**: Type answer → check to see model answer + XP
4. XP accumulates and user levels up
5. All explanations relate back to the favorite show

## Dependencies
- Flask 3.0.0
- OpenAI >=1.57.0 (using Replit AI Integrations)

## User Preferences
None documented yet.

## Known Issues
None identified.

## Next Steps (Potential Enhancements)
1. Add streak tracking for consecutive correct answers
2. Implement quiz history with performance statistics
3. Create leaderboard system
4. Add difficulty levels that adjust show reference complexity
5. Enable quiz export to PDF with show references included
6. Allow users to save and switch between multiple favorite shows
7. Add hints system for MCQ questions (costs XP)
8. Create achievement badges for milestones
