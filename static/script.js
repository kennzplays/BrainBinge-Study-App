let selectedSubject = '';
let currentXP = 0;
let currentLevel = 1;
let currentQuestions = [];

const levelTitles = {
    1: "Brain Rookie",
    2: "Study Starter",
    3: "Quiz Grinder",
    4: "Brain Binger"
};

document.addEventListener('DOMContentLoaded', function() {
    loadXP();
    setupEventListeners();
});

function setupEventListeners() {
    const subjectButtons = document.querySelectorAll('.subject-btn');
    subjectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            subjectButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedSubject = this.dataset.subject;
            document.getElementById('custom-subject-input').value = '';
        });
    });

    document.getElementById('custom-subject-input').addEventListener('input', function() {
        if (this.value.trim()) {
            subjectButtons.forEach(b => b.classList.remove('active'));
            selectedSubject = this.value.trim();
        }
    });

    document.getElementById('generate-quiz-btn').addEventListener('click', generateQuiz);
    document.getElementById('breakdown-quiz-btn').addEventListener('click', generateBreakdown);
}

function loadXP() {
    const savedXP = localStorage.getItem('brainbinge_xp');
    if (savedXP) {
        currentXP = parseInt(savedXP);
        updateXPDisplay();
    }
}

function saveXP() {
    localStorage.setItem('brainbinge_xp', currentXP.toString());
}

function updateXPDisplay() {
    currentLevel = Math.floor(currentXP / 50) + 1;
    const xpInLevel = currentXP % 50;
    const progressPercent = (xpInLevel / 50) * 100;

    const levelTitle = levelTitles[currentLevel] || levelTitles[4];
    
    document.getElementById('level-text').textContent = `Level ${currentLevel} - ${levelTitle}`;
    document.getElementById('xp-text').textContent = `XP: ${currentXP}`;
    
    const xpBar = document.getElementById('xp-bar');
    xpBar.style.width = progressPercent + '%';
}

function addXP(amount) {
    showXPNotification(`+${amount} XP!`);
    
    const xpBar = document.getElementById('xp-bar');
    xpBar.classList.add('animate');
    
    setTimeout(() => {
        currentXP += amount;
        saveXP();
        updateXPDisplay();
        
        setTimeout(() => {
            xpBar.classList.remove('animate');
        }, 500);
    }, 300);
}

function showXPNotification(text) {
    const notification = document.createElement('div');
    notification.className = 'xp-notification';
    notification.textContent = text;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 1500);
}

function showLoading() {
    document.getElementById('loading-overlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('show');
}

async function generateQuiz() {
    const topic = document.getElementById('topic-input').value.trim();
    const favoriteShow = document.getElementById('favorite-show-input').value.trim();
    const questionType = document.getElementById('question-type-select').value;
    
    if (!selectedSubject) {
        alert('Please select or enter a subject first!');
        return;
    }
    
    if (!topic) {
        alert('Please enter a topic or concept to study!');
        return;
    }
    
    if (!favoriteShow) {
        alert('Please enter your favorite show or anime!');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/generate_quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject: selectedSubject,
                topic: topic,
                favorite_show: favoriteShow,
                question_type: questionType
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const data = JSON.parse(result.data);
            currentQuestions = data.questions;
            displayQuiz(data);
        } else {
            alert('Error generating quiz: ' + result.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function generateBreakdown() {
    const topic = document.getElementById('topic-input').value.trim();
    const favoriteShow = document.getElementById('favorite-show-input').value.trim();
    const questionType = document.getElementById('question-type-select').value;
    
    if (!selectedSubject) {
        alert('Please select or enter a subject first!');
        return;
    }
    
    if (!topic) {
        alert('Please enter a topic or concept to study!');
        return;
    }
    
    if (!favoriteShow) {
        alert('Please enter your favorite show or anime!');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/breakdown_quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject: selectedSubject,
                topic: topic,
                favorite_show: favoriteShow,
                question_type: questionType
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const data = JSON.parse(result.data);
            currentQuestions = data.questions;
            displayBreakdown(data);
        } else {
            alert('Error generating breakdown: ' + result.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

function displayQuiz(data) {
    const outputSection = document.getElementById('output-section');
    
    let html = '<div class="content-card"><h3>📝 Quiz Questions</h3>';
    
    if (data.questions && data.questions.length > 0) {
        data.questions.forEach((q, index) => {
            html += `<div class="question-card" id="question-${index}">`;
            html += `<h4>Question ${index + 1}</h4>`;
            html += `<p>${q.question}</p>`;
            
            if (q.type === 'mcq') {
                html += renderMCQ(q, index);
            } else {
                html += renderFreeResponse(q, index);
            }
            
            html += '</div>';
        });
    } else {
        html += '<p>No questions generated. Please try again.</p>';
    }
    
    html += '</div>';
    outputSection.innerHTML = html;
    
    if (window.MathJax) {
        MathJax.typesetPromise([outputSection]).catch((err) => console.log(err));
    }
}

function renderMCQ(question, index) {
    let html = '<div class="mcq-options">';
    const options = ['A', 'B', 'C', 'D'];
    
    options.forEach(option => {
        html += `
            <button class="mcq-option-btn" onclick="checkMCQAnswer('${option}', ${index})" data-question="${index}" data-option="${option}">
                <span class="option-letter">${option}</span>
                <span>${question.options[option]}</span>
            </button>
        `;
    });
    
    html += '</div>';
    html += `<div class="answer-feedback-container" id="feedback-${index}"></div>`;
    
    return html;
}

function renderFreeResponse(question, index) {
    let html = `
        <textarea class="free-response-input" id="free-response-${index}" placeholder="Type your answer here..."></textarea>
        <button class="check-answer-btn" onclick="checkFreeResponse(${index})">Check Answer</button>
        <div class="answer-feedback-container" id="feedback-${index}"></div>
    `;
    return html;
}

function displayBreakdown(data) {
    const outputSection = document.getElementById('output-section');
    
    let html = '<div class="content-card">';
    
    html += '<h3>📖 Concept Breakdown</h3>';
    
    if (data.introduction) {
        html += '<div class="breakdown-section">';
        html += '<h4>Introduction</h4>';
        html += `<p>${data.introduction}</p>`;
        html += '</div>';
    }
    
    if (data.explanation && data.explanation.length > 0) {
        html += '<div class="breakdown-section">';
        html += '<h4>Step-by-Step Explanation</h4>';
        data.explanation.forEach((step, index) => {
            html += `<p><strong>Step ${index + 1}:</strong> ${step}</p>`;
        });
        html += '</div>';
    }
    
    if (data.key_points && data.key_points.length > 0) {
        html += '<div class="breakdown-section">';
        html += '<h4>Key Points</h4>';
        html += '<ul>';
        data.key_points.forEach(point => {
            html += `<li>${point}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    html += '</div>';
    
    if (data.questions && data.questions.length > 0) {
        html += '<div class="content-card"><h3>✏️ Practice Questions</h3>';
        data.questions.forEach((q, index) => {
            html += `<div class="question-card" id="question-${index}">`;
            html += `<h4>Question ${index + 1}</h4>`;
            html += `<p>${q.question}</p>`;
            
            if (q.type === 'mcq') {
                html += renderMCQ(q, index);
            } else {
                html += renderFreeResponse(q, index);
            }
            
            html += '</div>';
        });
        html += '</div>';
    }
    
    outputSection.innerHTML = html;
    
    if (window.MathJax) {
        MathJax.typesetPromise([outputSection]).catch((err) => console.log(err));
    }
}

function checkMCQAnswer(selectedOption, questionIndex) {
    if (!currentQuestions || !currentQuestions[questionIndex]) {
        console.error('Question not found:', questionIndex);
        return;
    }
    
    const question = currentQuestions[questionIndex];
    const isCorrect = selectedOption === question.correct_option;
    
    const buttons = document.querySelectorAll(`[data-question="${questionIndex}"]`);
    buttons.forEach(btn => {
        btn.disabled = true;
        const option = btn.dataset.option;
        if (option === question.correct_option) {
            btn.classList.add('correct');
        } else if (option === selectedOption && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    const feedbackContainer = document.getElementById(`feedback-${questionIndex}`);
    if (!feedbackContainer) {
        console.error('Feedback container not found');
        return;
    }
    
    const feedbackClass = isCorrect ? 'correct' : 'incorrect';
    const feedbackTitle = isCorrect ? '✅ Correct!' : '❌ Incorrect';
    const explanation = isCorrect ? (question.explanation_correct || 'Correct!') : (question.explanation_incorrect || 'Try again!');
    
    feedbackContainer.innerHTML = `
        <div class="answer-feedback ${feedbackClass}">
            <h5>${feedbackTitle}</h5>
            <p>${explanation}</p>
        </div>
    `;
    
    const xpAwarded = isCorrect ? 15 : 5;
    addXP(xpAwarded);
    
    if (window.MathJax) {
        MathJax.typesetPromise([feedbackContainer]).catch((err) => console.log(err));
    }
}

async function checkFreeResponse(questionIndex) {
    if (!currentQuestions || !currentQuestions[questionIndex]) {
        console.error('Question not found:', questionIndex);
        return;
    }
    
    const question = currentQuestions[questionIndex];
    const userAnswer = document.getElementById(`free-response-${questionIndex}`).value.trim();
    
    if (!userAnswer) {
        alert('Please enter your answer first!');
        return;
    }
    
    const feedbackContainer = document.getElementById(`feedback-${questionIndex}`);
    if (!feedbackContainer) {
        console.error('Feedback container not found');
        return;
    }
    
    const checkButton = feedbackContainer.previousElementSibling;
    if (checkButton) {
        checkButton.disabled = true;
        checkButton.textContent = 'Grading...';
    }
    
    try {
        const response = await fetch('/grade_free_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question.question,
                model_answer: question.answer,
                user_answer: userAnswer
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Grading failed');
        }
        
        const grading = JSON.parse(result.data);
        const isCorrect = grading.is_correct;
        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        const feedbackTitle = isCorrect ? '✅ Correct!' : '❌ Not quite';
        
        feedbackContainer.innerHTML = `
            <div class="answer-feedback ${feedbackClass}">
                <h5>${feedbackTitle} (Score: ${grading.score}/100)</h5>
                <p>${grading.feedback}</p>
                <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                <p><strong>Suggested answer:</strong> ${question.answer}</p>
            </div>
        `;
        
        const xpAwarded = isCorrect ? 15 : 5;
        addXP(xpAwarded);
        
        if (window.MathJax) {
            MathJax.typesetPromise([feedbackContainer]).catch((err) => console.log(err));
        }
        
    } catch (error) {
        console.error('Error grading answer:', error);
        feedbackContainer.innerHTML = `
            <div class="answer-feedback incorrect">
                <h5>⚠️ Error</h5>
                <p>Could not grade your answer. Please try again.</p>
                <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                <p><strong>Suggested answer:</strong> ${question.answer}</p>
            </div>
        `;
        if (checkButton) {
            checkButton.disabled = false;
            checkButton.textContent = 'Check Answer';
        }
    }
}
