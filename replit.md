# BrainBinge - Study & Quiz Web App

## Overview
BrainBinge is a gamified study and quiz web application that uses AI to generate educational content **related to the user's favorite show or anime**. Users select subjects, describe topics they want to learn, enter their favorite show, choose question type, and receive AI-generated quiz questions or comprehensive topic breakdowns that connect the learning material to their favorite show.

**Unique Feature**: All content includes **interactive answer checking** where users can click MCQ options or check free response answers, receiving instant feedback with explanations themed around their favorite show.

## Current State
Fully functional MVP with all core features implemented, including interactive quiz functionality with dynamic XP rewards. Running on Flask server (port 5000).

## Recent Changes (November 16, 2025)
- **Latest Major Update**: Added interactive answer checking system
  - MCQ questions now display as clickable A/B/C/D buttons
  - Users get instant feedback (correct/incorrect) with show-themed explanations
  - Dynamic XP awards: +15 XP for correct MCQ answers, +5 XP for incorrect
  - Free response questions show model answers with +10 XP
  - Changed question type selection from radio buttons to dropdown
  - Added support for "mixed" question type (both MCQ and free response)
  - Added subtitle: "Turn any topic into a lesson based on your favorite shows and anime"
  
- **Previous Updates**: 
  - Added favorite show/anime integration
  - Updated AI prompts to ALWAYS relate explanations and questions to user's favorite show
  - Backend accepts `favorite_show` and `question_type` parameters

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
   - **MCQ**: Click A/B/C/D buttons, get instant feedback
   - **Free Response**: Type answer, click "Check Answer" to see model answer
   - Show-themed explanations for correct/incorrect answers
5. **Two Generation Modes**:
   - **Quiz Questions**: Generates 5-7 interactive questions
   - **Breakdown + Quiz**: Structured explanation + 3-5 interactive practice questions
6. **Dynamic XP System**: 
   - MCQ correct: +15 XP
   - MCQ incorrect: +5 XP
   - Free response: +10 XP
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
