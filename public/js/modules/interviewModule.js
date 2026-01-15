// ========================================
// Interview Preparation Module
// ========================================

class InterviewModule {
    constructor() {
        this.questions = [];
        this.responses = [];
        this.interviews = [];
        this.init();
    }

    init() {
        this.loadData();
        this.loadCommonQuestions();
        this.renderDashboard();
    }

    loadData() {
        this.responses = window.MoneyCareerApp.getFromLocalStorage('interviewResponses') || [];
        this.interviews = window.MoneyCareerApp.getFromLocalStorage('upcomingInterviews') || [];
    }

    saveData() {
        window.MoneyCareerApp.saveToLocalStorage('interviewResponses', this.responses);
        window.MoneyCareerApp.saveToLocalStorage('upcomingInterviews', this.interviews);
    }

    loadCommonQuestions() {
        this.questions = [
            { id: 1, question: 'Tell me about yourself', category: 'General', difficulty: 'Easy' },
            { id: 2, question: 'What are your greatest strengths?', category: 'General', difficulty: 'Easy' },
            { id: 3, question: 'What are your weaknesses?', category: 'General', difficulty: 'Medium' },
            { id: 4, question: 'Why do you want to work here?', category: 'Company', difficulty: 'Medium' },
            { id: 5, question: 'Where do you see yourself in 5 years?', category: 'Career Goals', difficulty: 'Medium' },
            { id: 6, question: 'Describe a challenging situation and how you handled it', category: 'Behavioral', difficulty: 'Hard' },
            { id: 7, question: 'Tell me about a time you failed', category: 'Behavioral', difficulty: 'Hard' },
            { id: 8, question: 'How do you handle stress and pressure?', category: 'Behavioral', difficulty: 'Medium' },
            { id: 9, question: 'What makes you unique?', category: 'General', difficulty: 'Medium' },
            { id: 10, question: 'Do you have any questions for us?', category: 'Closing', difficulty: 'Easy' }
        ];
    }

    renderDashboard() {
        const container = document.getElementById('moduleContainer');
        if (!container) return;

        const practiceCount = this.responses.length;
        const upcomingCount = this.interviews.filter(i => new Date(i.date) > new Date()).length;

        container.innerHTML = `
            <div class="module-dashboard">
                <div class="stat-card" style="background: linear-gradient(135deg, #1565C0, #1976D2);">
                    <div class="stat-value">${practiceCount}</div>
                    <div class="stat-label">Questions Practiced</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #FFA726, #FFB74D);">
                    <div class="stat-value">${upcomingCount}</div>
                    <div class="stat-label">Upcoming Interviews</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #43A047, #66BB6A);">
                    <div class="stat-value">${this.questions.length}</div>
                    <div class="stat-label">Question Bank</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #2E7D32, #4CAF50);">
                    <div class="stat-value">${this.calculateReadiness()}%</div>
                    <div class="stat-label">Readiness Score</div>
                </div>
            </div>

            <div class="card-grid" style="margin-top: 2rem;">
                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon interview-icon">
                            <i class="fas fa-calendar-plus"></i>
                        </div>
                        <h3 class="card-title">Upcoming Interviews</h3>
                    </div>
                    <div class="card-content">
                        ${this.renderUpcomingInterviews()}
                    </div>
                    <button class="btn btn-primary" onclick="interviewModule.addInterview()">
                        <i class="fas fa-plus"></i> Add Interview
                    </button>
                </div>

                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon career-icon">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <h3 class="card-title">Quick Tips</h3>
                    </div>
                    <div class="card-content">
                        ${this.renderQuickTips()}
                    </div>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon tasks-icon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <h3 class="card-title">Common Interview Questions</h3>
                </div>
                ${this.renderQuestions()}
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon finance-icon">
                        <i class="fas fa-list-check"></i>
                    </div>
                    <h3 class="card-title">Pre-Interview Checklist</h3>
                </div>
                <div class="checklist">
                    ${this.renderChecklist()}
                </div>
            </div>

            <div class="action-buttons" style="margin-top: 2rem;">
                <button class="btn btn-primary" onclick="interviewModule.startMockInterview()">
                    <i class="fas fa-play"></i> Start Mock Interview
                </button>
                <button class="btn btn-success" onclick="interviewModule.getAIFeedback()">
                    <i class="fas fa-robot"></i> Get AI Feedback
                </button>
                <button class="btn btn-info" onclick="interviewModule.exportPrep()">
                    <i class="fas fa-download"></i> Export Prep Notes
                </button>
            </div>
        `;
    }

    renderUpcomingInterviews() {
        const upcoming = this.interviews.filter(i => new Date(i.date) > new Date());
        
        if (upcoming.length === 0) {
            return '<p class="empty-state-text">No upcoming interviews scheduled</p>';
        }

        return upcoming.map(interview => `
            <div style="padding: 1rem; background: var(--neutral-bg); border-radius: var(--radius-md); margin-bottom: 1rem;">
                <h4>${interview.company}</h4>
                <p style="color: var(--neutral-medium);">${interview.position}</p>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <span class="tag tag-accent">
                        <i class="fas fa-calendar"></i> ${window.MoneyCareerApp.formatDate(interview.date)}
                    </span>
                    <span class="tag tag-secondary">
                        <i class="fas fa-clock"></i> ${interview.time}
                    </span>
                </div>
            </div>
        `).join('');
    }

    renderQuickTips() {
        const tips = [
            '✅ Research the company thoroughly',
            '✅ Prepare STAR format answers',
            '✅ Practice with a friend or mentor',
            '✅ Dress appropriately',
            '✅ Arrive 10-15 minutes early',
            '✅ Bring extra copies of your resume',
            '✅ Prepare thoughtful questions',
            '✅ Follow up with a thank-you email'
        ];

        return `<ul style="list-style: none; padding: 0;">${tips.map(tip => 
            `<li style="padding: 0.25rem 0;">${tip}</li>`
        ).join('')}</ul>`;
    }

    renderQuestions() {
        const categories = [...new Set(this.questions.map(q => q.category))];
        
        return `
            <div>
                ${categories.map(category => `
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">
                            <i class="fas fa-folder"></i> ${category}
                        </h4>
                        <div class="card-grid">
                            ${this.questions
                                .filter(q => q.category === category)
                                .map(q => `
                                    <div style="padding: 1rem; background: var(--neutral-bg); border-radius: var(--radius-md); cursor: pointer;" 
                                         onclick="interviewModule.practiceQuestion(${q.id})">
                                        <div style="display: flex; justify-content: space-between; align-items: start;">
                                            <p style="flex: 1; margin-bottom: 0.5rem;"><strong>${q.question}</strong></p>
                                            <span class="tag tag-${q.difficulty === 'Easy' ? 'primary' : q.difficulty === 'Medium' ? 'secondary' : 'accent'}">${q.difficulty}</span>
                                        </div>
                                        <small style="color: var(--primary-color);">
                                            <i class="fas fa-arrow-right"></i> Click to practice
                                        </small>
                                    </div>
                                `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderChecklist() {
        const items = [
            { id: 1, text: 'Research company background and culture', completed: false },
            { id: 2, text: 'Review job description and requirements', completed: false },
            { id: 3, text: 'Prepare answers to common questions', completed: false },
            { id: 4, text: 'Practice behavioral questions (STAR method)', completed: false },
            { id: 5, text: 'Prepare questions to ask the interviewer', completed: false },
            { id: 6, text: 'Review your resume and be ready to discuss', completed: false },
            { id: 7, text: 'Plan your outfit and test video setup', completed: false },
            { id: 8, text: 'Gather necessary documents and materials', completed: false }
        ];

        return items.map(item => `
            <div class="checklist-item">
                <input type="checkbox" class="checklist-checkbox" onchange="interviewModule.toggleChecklistItem(${item.id})">
                <span class="checklist-text">${item.text}</span>
            </div>
        `).join('');
    }

    addInterview() {
        const company = prompt('Company name:');
        if (!company) return;

        const position = prompt('Position:');
        if (!position) return;

        const date = prompt('Interview date (YYYY-MM-DD):');
        if (!date) return;

        const time = prompt('Interview time (e.g., 2:00 PM):');
        if (!time) return;

        this.interviews.push({
            id: Date.now(),
            company,
            position,
            date,
            time,
            createdAt: new Date().toISOString()
        });

        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Interview added successfully! Good luck!');
    }

    practiceQuestion(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        const answer = prompt(`Question: ${question.question}\n\nType your answer:`);
        if (!answer) return;

        this.responses.push({
            questionId,
            question: question.question,
            answer,
            timestamp: new Date().toISOString()
        });

        this.saveData();
        window.MoneyCareerApp.showAlert('success', 'Response saved! Keep practicing to improve your answers.');
    }

    toggleChecklistItem(itemId) {
        window.MoneyCareerApp.showAlert('success', 'Checklist updated!');
    }

    calculateReadiness() {
        // Simple readiness calculation based on practice
        const practiceScore = Math.min((this.responses.length / 10) * 100, 70);
        const interviewScore = this.interviews.length > 0 ? 30 : 0;
        return Math.round(practiceScore + interviewScore);
    }

    startMockInterview() {
        window.MoneyCareerApp.showAlert('info', 'Starting mock interview with AI Assistant...');
        window.MoneyCareerApp.openChatbot();
    }

    getAIFeedback() {
        window.MoneyCareerApp.showAlert('info', 'Opening AI Assistant for personalized interview feedback...');
        window.MoneyCareerApp.openChatbot();
    }

    exportPrep() {
        const data = {
            responses: this.responses,
            interviews: this.interviews,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-prep-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        window.MoneyCareerApp.showAlert('success', 'Interview preparation notes exported!');
    }
}

// Initialize module if on interview page
if (window.location.pathname.includes('interview')) {
    const interviewModule = new InterviewModule();
    window.interviewModule = interviewModule;
}
