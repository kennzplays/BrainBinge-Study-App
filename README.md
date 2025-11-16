
# BrainBinge

BrainBinge is a gamified study and quiz web application that uses AI to generate educational explanations and practice questions based on the user’s favorite show or anime. Users select a subject, describe a topic, choose a show, select a question type, and receive interactive quizzes or structured breakdowns that connect academic material to familiar fictional worlds.

This project is a fully functional minimum viable product built for the CS Girlies Hackathon.

---

## Overview

BrainBinge personalizes learning by blending school subjects with show/anime references chosen by the user. The system generates explanations, analogies, and quizzes that connect difficult concepts to characters, plots, and themes from the selected show. Users can complete multiple-choice or free-response questions and earn XP as they progress.

---

## Features

**Subject and Topic Input**

* Five preset subjects plus custom subject entry.
* User enters any topic they want to learn.

**Show/Anime Integration**

* All explanations, analogies, and question feedback reference the user’s chosen show.

**Interactive Quiz Types**

* Multiple Choice (A/B/C/D)
* Free Response
* Mixed Mode (combination of both)
* Dropdown control for selecting type

**Answer Checking System**

* MCQ options are clickable and provide instant correct/incorrect feedback.
* Free response answers are graded with AI similarity scoring (0–100).
* Correctness threshold set at 70% to prevent users from entering unrelated text.
* Feedback includes similarity score, reasoning, and model answer.

**Two Generation Modes**

1. Quiz Only (5–7 questions)
2. Breakdown + Quiz (structured topic explanation + 3–5 questions)

**Gamification**

* XP system stored with localStorage
* +15 XP for correct answers
* +5 XP for incorrect answers
* Level progression every 50 XP
* Level titles: Brain Rookie, Study Starter, Quiz Grinder, Brain Binger

**Math Support**

* MathJax enabled for LaTeX rendering
* Useful for math and science subjects

**Responsive Interface**

* Blue and white theme
* Works on desktop and mobile layouts

---

## Tech Stack

**Backend:** Python 3.11, Flask 3.0.0
**Frontend:** HTML5, CSS3, JavaScript
**AI:** Replit AI (gpt-4o-mini model, ChatGPT
**Math Rendering:** MathJax 3
**Storage:** Browser LocalStorage

---

## Project Structure

```
/
├── app.py                  # Flask backend and AI endpoints
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html          # Main UI template
├── static/
│   ├── style.css           # Styling and layout
│   └── script.js           # XP system, UI logic, answer checking
└── README.md               # Documentation
```

---

## How It Works

1. User selects a subject and enters a topic.
2. User enters their favorite show or anime.
3. User selects a question type (MCQ, Free Response, or Mixed).
4. Application generates either a quiz or a full breakdown with practice questions.
5. User answers questions and receives instant feedback.
6. XP is awarded for every question, correct or incorrect.
7. User progresses through levels based on total XP.

---

## Current Status

BrainBinge is a fully functional MVP. All core features are implemented, including:

* Show-based explanations
* MCQ and free-response quizzes
* Mixed question mode
* AI-based free response grading
* XP and level progression
* MathJax support
* Responsive design

---

## Known Issues

No major issues identified at this time.

---

## Planned Improvements

* Streak tracking
* Quiz history and performance analytics
* Leaderboards
* Adjustable difficulty levels
* Preset show/anime templates
* Ability to save multiple favorite shows
* Export quizzes to PDF
* Achievement badge system
* XP-based hint system

