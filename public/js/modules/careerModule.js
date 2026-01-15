// ========================================
// Career Mapping Module
// ========================================

class CareerModule {
    constructor() {
        this.careerGoals = [];
        this.skills = [];
        this.milestones = [];
        this.init();
    }

    init() {
        this.loadData();
        this.renderDashboard();
    }

    loadData() {
        this.careerGoals = window.MoneyCareerApp.getFromLocalStorage('careerGoals') || [];
        this.skills = window.MoneyCareerApp.getFromLocalStorage('skills') || [];
        this.milestones = window.MoneyCareerApp.getFromLocalStorage('milestones') || [];
    }

    saveData() {
        window.MoneyCareerApp.saveToLocalStorage('careerGoals', this.careerGoals);
        window.MoneyCareerApp.saveToLocalStorage('skills', this.skills);
        window.MoneyCareerApp.saveToLocalStorage('milestones', this.milestones);
    }

    renderDashboard() {
        const container = document.getElementById('moduleContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="module-dashboard">
                <div class="stat-card" style="background: linear-gradient(135deg, #FFA726, #FFB74D);">
                    <div class="stat-value">${this.skills.length}</div>
                    <div class="stat-label">Skills Tracked</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #43A047, #66BB6A);">
                    <div class="stat-value">${this.milestones.filter(m => m.completed).length}</div>
                    <div class="stat-label">Milestones Achieved</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #1565C0, #1976D2);">
                    <div class="stat-value">${this.careerGoals.length}</div>
                    <div class="stat-label">Career Goals</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #2E7D32, #4CAF50);">
                    <div class="stat-value">${this.calculateProgress()}%</div>
                    <div class="stat-label">Overall Progress</div>
                </div>
            </div>

            <div class="card-grid" style="margin-top: 2rem;">
                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon career-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <h3 class="card-title">Career Goals</h3>
                    </div>
                    <div class="card-content">
                        ${this.renderCareerGoals()}
                    </div>
                    <button class="btn btn-primary" onclick="careerModule.addCareerGoal()">
                        <i class="fas fa-plus"></i> Add Goal
                    </button>
                </div>

                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon tasks-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3 class="card-title">Skills Development</h3>
                    </div>
                    <div class="card-content">
                        ${this.renderSkills()}
                    </div>
                    <button class="btn btn-success" onclick="careerModule.addSkill()">
                        <i class="fas fa-plus"></i> Add Skill
                    </button>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon investing-icon">
                        <i class="fas fa-route"></i>
                    </div>
                    <h3 class="card-title">Career Roadmap</h3>
                </div>
                <div class="timeline">
                    ${this.renderTimeline()}
                </div>
                <button class="btn btn-info" onclick="careerModule.addMilestone()">
                    <i class="fas fa-plus"></i> Add Milestone
                </button>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon finance-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3 class="card-title">AI Career Guidance</h3>
                </div>
                <div class="card-content">
                    ${this.renderGuidance()}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="careerModule.getPersonalizedPlan()">
                        <i class="fas fa-robot"></i> Get Personalized Plan
                    </button>
                    <button class="btn btn-success" onclick="careerModule.exportRoadmap()">
                        <i class="fas fa-download"></i> Export Roadmap
                    </button>
                </div>
            </div>
        `;
    }

    renderCareerGoals() {
        if (this.careerGoals.length === 0) {
            return '<p class="empty-state-text">No career goals set yet. Add your first goal to get started!</p>';
        }

        return this.careerGoals.map(goal => `
            <div style="padding: 1rem; background: var(--neutral-bg); border-radius: var(--radius-md); margin-bottom: 1rem;">
                <h4>${goal.title}</h4>
                <p style="color: var(--neutral-medium);">${goal.description}</p>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <span class="tag tag-accent">Target: ${goal.deadline}</span>
                    <span class="tag tag-${goal.status === 'completed' ? 'primary' : 'secondary'}">${goal.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderSkills() {
        if (this.skills.length === 0) {
            return '<p class="empty-state-text">Start tracking your skills to monitor your growth</p>';
        }

        return this.skills.map(skill => `
            <div class="progress-container">
                <div class="progress-label">
                    <span><strong>${skill.name}</strong></span>
                    <span>${skill.level}/10</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${skill.level * 10}%"></div>
                </div>
                <small style="color: var(--neutral-medium);">${skill.category}</small>
            </div>
        `).join('');
    }

    renderTimeline() {
        if (this.milestones.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-map-signs"></i></div>
                    <div class="empty-state-title">No Milestones Yet</div>
                    <p class="empty-state-text">Create your career roadmap by adding milestones</p>
                </div>
            `;
        }

        return this.milestones.map(milestone => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${milestone.date}</div>
                    <div class="timeline-title">${milestone.title}</div>
                    <p>${milestone.description}</p>
                    ${milestone.completed ? 
                        '<span class="tag tag-primary"><i class="fas fa-check"></i> Completed</span>' : 
                        '<span class="tag tag-secondary">In Progress</span>'
                    }
                </div>
            </div>
        `).join('');
    }

    renderGuidance() {
        const guidance = [
            {
                title: 'Network Actively',
                description: 'Connect with professionals in your field on LinkedIn. Attend industry events and webinars.',
                icon: 'users'
            },
            {
                title: 'Build Your Portfolio',
                description: 'Showcase your work through projects, case studies, and contributions to open source.',
                icon: 'folder-open'
            },
            {
                title: 'Seek Mentorship',
                description: 'Find a mentor who can guide you through career decisions and share valuable insights.',
                icon: 'user-graduate'
            },
            {
                title: 'Stay Updated',
                description: 'Keep learning about industry trends, new technologies, and best practices in your field.',
                icon: 'book-reader'
            }
        ];

        return `
            <div class="card-grid">
                ${guidance.map(item => `
                    <div style="padding: 1rem; background: var(--neutral-bg); border-radius: var(--radius-md);">
                        <i class="fas fa-${item.icon}" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                        <h4 style="margin-bottom: 0.5rem;">${item.title}</h4>
                        <p style="color: var(--neutral-medium); font-size: 0.875rem;">${item.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    addCareerGoal() {
        const title = prompt('Career goal title (e.g., "Become Senior Developer"):');
        if (!title) return;

        const description = prompt('Brief description:');
        if (!description) return;

        const deadline = prompt('Target date (e.g., "2027"):');
        if (!deadline) return;

        this.careerGoals.push({
            id: Date.now(),
            title,
            description,
            deadline,
            status: 'in-progress',
            createdAt: new Date().toISOString()
        });

        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Career goal added successfully!');
    }

    addSkill() {
        const name = prompt('Skill name (e.g., "Python", "Public Speaking"):');
        if (!name) return;

        const category = prompt('Category (e.g., "Technical", "Soft Skills"):');
        if (!category) return;

        const level = parseInt(prompt('Current proficiency level (1-10):'));
        if (!level || isNaN(level) || level < 1 || level > 10) {
            window.MoneyCareerApp.showAlert('error', 'Please enter a valid level (1-10)');
            return;
        }

        this.skills.push({
            id: Date.now(),
            name,
            category,
            level,
            createdAt: new Date().toISOString()
        });

        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Skill added successfully!');
    }

    addMilestone() {
        const title = prompt('Milestone title (e.g., "Complete certification"):');
        if (!title) return;

        const description = prompt('Description:');
        if (!description) return;

        const date = prompt('Target/Completion date (e.g., "Q2 2026"):');
        if (!date) return;

        this.milestones.push({
            id: Date.now(),
            title,
            description,
            date,
            completed: false,
            createdAt: new Date().toISOString()
        });

        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Milestone added to your roadmap!');
    }

    calculateProgress() {
        if (this.milestones.length === 0) return 0;
        const completed = this.milestones.filter(m => m.completed).length;
        return Math.round((completed / this.milestones.length) * 100);
    }

    getPersonalizedPlan() {
        window.MoneyCareerApp.showAlert('info', 'Opening AI Assistant for personalized career planning...');
        window.MoneyCareerApp.openChatbot();
    }

    exportRoadmap() {
        const data = {
            careerGoals: this.careerGoals,
            skills: this.skills,
            milestones: this.milestones,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `career-roadmap-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        window.MoneyCareerApp.showAlert('success', 'Career roadmap exported successfully!');
    }
}

// Initialize module if on career page
if (window.location.pathname.includes('career')) {
    const careerModule = new CareerModule();
    window.careerModule = careerModule;
}
