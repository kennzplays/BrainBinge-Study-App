# BrainBinge - Study & Quiz Web App

## Overview
BrainBinge is a gamified study and quiz web application that uses AI to generate educational content. Users can select subjects, describe topics they want to learn, and receive AI-generated quiz questions or comprehensive topic breakdowns with practice questions.

## Current State
Fully functional MVP with all core features implemented and running on Flask server (port 5000).

## Recent Changes (November 16, 2025)
- Initial project setup and complete implementation
- Flask backend with OpenAI AI Integrations for quiz and breakdown generation
- Frontend with subject selection, topic input, and two generation modes
- XP system with localStorage persistence and level progression
- MathJax integration for LaTeX math rendering
- Blue/white themed responsive design

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
│   └── index.html         # Main HTML template
├── static/
│   ├── style.css          # Blue/white themed styling
│   └── script.js          # Frontend logic and XP system
└── replit.md              # This file
```

## Features
1. **Subject Selection**: 5 preset subjects + custom subject input
2. **Two Generation Modes**:
   - Quiz Questions: Generates 5-7 questions with answers
   - Breakdown + Quiz: Structured explanation with 3-5 practice questions
3. **XP System**: 
   - +10 XP for quiz generation
   - +15 XP for breakdown + quiz
   - Persistent storage via localStorage
   - Level progression (50 XP per level)
4. **Level Titles**:
   - Level 1: Brain Rookie
   - Level 2: Study Starter
   - Level 3: Quiz Grinder
   - Level 4+: Brain Binger
5. **LaTeX Support**: MathJax rendering for mathematical expressions
6. **Responsive Design**: Works on various screen sizes

## API Endpoints
- `GET /` - Main application page
- `POST /generate_quiz` - Generate quiz questions
- `POST /breakdown_quiz` - Generate topic breakdown with quiz

## Dependencies
- Flask 3.0.0
- OpenAI >=1.57.0 (using Replit AI Integrations)

## User Preferences
None documented yet.

## Known Issues
None identified.

## Next Steps (Potential Enhancements)
1. Add answer checking functionality with bonus XP rewards
2. Implement quiz history tracking
3. Create subject-specific difficulty levels
4. Add study streak tracking and achievement badges
5. Enable quiz export to PDF
