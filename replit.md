# BrainBinge - Study & Quiz Web App

## Overview
BrainBinge is a gamified study and quiz web application that uses AI to generate educational content **related to the user's favorite show or anime**. Users select subjects, describe topics they want to learn, enter their favorite show, choose question type, and receive AI-generated quiz questions or comprehensive topic breakdowns that connect the learning material to their favorite show.

## Current State
Fully functional MVP with all core features implemented and running on Flask server (port 5000).

## Recent Changes (November 16, 2025)
- **Latest Update**: Added favorite show/anime integration and question type selection
  - Added "Favorite show or anime" input field
  - Added question type selection (Free Response vs Multiple Choice)
  - Updated AI prompts to ALWAYS relate explanations and questions to user's favorite show
  - Backend now accepts `favorite_show` and `question_type` parameters
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
2. **Favorite Show Integration**: Users enter their favorite show/anime, and ALL content relates to it
3. **Question Type Selection**: 
   - Free Response Questions (open-ended)
   - Multiple Choice (A/B/C/D format)
4. **Two Generation Modes**:
   - **Quiz Questions**: Generates 5-7 questions with answers (related to favorite show)
   - **Breakdown + Quiz**: Structured explanation with 3-5 practice questions (using show as teaching analogies)
5. **XP System**: 
   - +10 XP for quiz generation
   - +15 XP for breakdown + quiz
   - Persistent storage via localStorage
   - Level progression (50 XP per level)
6. **Level Titles**:
   - Level 1: Brain Rookie
   - Level 2: Study Starter
   - Level 3: Quiz Grinder
   - Level 4+: Brain Binger
7. **LaTeX Support**: MathJax rendering for mathematical expressions
8. **Responsive Design**: Works on various screen sizes

## API Endpoints
- `GET /` - Main application page
- `POST /generate_quiz` - Generate quiz questions related to favorite show
  - Params: `subject`, `topic`, `favorite_show`, `question_type`
- `POST /breakdown_quiz` - Generate topic breakdown with quiz (using show analogies)
  - Params: `subject`, `topic`, `favorite_show`, `question_type`

## How It Works
The AI uses the user's favorite show/anime to create educational connections:
- Characters as examples (e.g., "Like Naruto's chakra control, mitosis requires...")
- Plot events as analogies (e.g., "Just as the One Ring corrupts, oxidation involves...")
- Power systems as frameworks (e.g., "Nen abilities in HxH are like chemical bonds...")
- Training arcs as learning progressions

## Dependencies
- Flask 3.0.0
- OpenAI >=1.57.0 (using Replit AI Integrations)

## User Preferences
None documented yet.

## Known Issues
None identified.

## Next Steps (Potential Enhancements)
1. Add answer checking functionality with bonus XP rewards
2. Implement quiz history tracking with favorite shows
3. Create difficulty levels that adjust show reference complexity
4. Add study streak tracking and achievement badges
5. Enable quiz export to PDF with show references included
6. Allow users to save and switch between multiple favorite shows
