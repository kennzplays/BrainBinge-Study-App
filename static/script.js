let selectedSubject = '';
let currentXP = 0;
let currentLevel = 1;

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
    
    if (!selectedSubject) {
        alert('Please select or enter a subject first!');
        return;
    }
    
    if (!topic) {
        alert('Please enter a topic or concept to study!');
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
                topic: topic
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const data = JSON.parse(result.data);
            displayQuiz(data);
            addXP(10);
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
    
    if (!selectedSubject) {
        alert('Please select or enter a subject first!');
        return;
    }
    
    if (!topic) {
        alert('Please enter a topic or concept to study!');
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
                topic: topic
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const data = JSON.parse(result.data);
            displayBreakdown(data);
            addXP(15);
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
            html += `
                <div class="question-card">
                    <h4>Question ${index + 1}</h4>
                    <p>${q.question}</p>
                    <button class="answer-toggle" onclick="toggleAnswer(${index})">Show Answer</button>
                    <div class="answer-content" id="answer-${index}">
                        <strong>Answer:</strong> ${q.answer}
                    </div>
                </div>
            `;
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
            html += `
                <div class="question-card">
                    <h4>Question ${index + 1}</h4>
                    <p>${q.question}</p>
                    <button class="answer-toggle" onclick="toggleAnswer(${index})">Show Answer</button>
                    <div class="answer-content" id="answer-${index}">
                        <strong>Answer:</strong> ${q.answer}
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    outputSection.innerHTML = html;
    
    if (window.MathJax) {
        MathJax.typesetPromise([outputSection]).catch((err) => console.log(err));
    }
}

function toggleAnswer(index) {
    const answerDiv = document.getElementById(`answer-${index}`);
    answerDiv.classList.toggle('show');
}
