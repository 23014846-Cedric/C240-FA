// ========================================
// Investing Coach Module
// ========================================

class InvestingModule {
    constructor() {
        this.portfolio = [];
        this.goals = [];
        this.riskProfile = null;
        this.init();
    }

    init() {
        this.loadData();
        this.renderDashboard();
        this.attachEventListeners();
    }

    loadData() {
        this.portfolio = window.MoneyCareerApp.getFromLocalStorage('portfolio') || [];
        this.goals = window.MoneyCareerApp.getFromLocalStorage('investmentGoals') || [];
        this.riskProfile = window.MoneyCareerApp.getFromLocalStorage('riskProfile') || null;
    }

    saveData() {
        window.MoneyCareerApp.saveToLocalStorage('portfolio', this.portfolio);
        window.MoneyCareerApp.saveToLocalStorage('investmentGoals', this.goals);
        window.MoneyCareerApp.saveToLocalStorage('riskProfile', this.riskProfile);
    }

    renderDashboard() {
        const container = document.getElementById('moduleContainer');
        if (!container) return;

        const totalValue = this.calculatePortfolioValue();
        const totalGains = this.calculateTotalGains();
        const diversificationScore = this.calculateDiversification();

        container.innerHTML = `
            <div class="module-dashboard">
                <div class="stat-card" style="background: linear-gradient(135deg, #1565C0, #1976D2);">
                    <div class="stat-value">${window.MoneyCareerApp.formatCurrency(totalValue)}</div>
                    <div class="stat-label">Portfolio Value</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #43A047, #66BB6A);">
                    <div class="stat-value">${window.MoneyCareerApp.formatCurrency(totalGains)}</div>
                    <div class="stat-label">Total Gains</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #FFA726, #FFB74D);">
                    <div class="stat-value">${diversificationScore}/10</div>
                    <div class="stat-label">Diversification Score</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #2E7D32, #4CAF50);">
                    <div class="stat-value">${this.getRiskLevel()}</div>
                    <div class="stat-label">Risk Profile</div>
                </div>
            </div>

            ${!this.riskProfile ? this.renderRiskAssessment() : ''}

            <div class="card-grid" style="margin-top: 2rem;">
                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon investing-icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <h3 class="card-title">Investment Strategy</h3>
                    </div>
                    <div class="card-content">
                        ${this.renderInvestmentStrategy()}
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="investingModule.getPersonalizedAdvice()">
                            <i class="fas fa-robot"></i> Get AI Advice
                        </button>
                    </div>
                </div>

                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon career-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <h3 class="card-title">Investment Goals</h3>
                    </div>
                    <div class="card-content">
                        ${this.renderGoals()}
                    </div>
                    <button class="btn btn-success" onclick="investingModule.addGoal()">
                        <i class="fas fa-plus"></i> Add Goal
                    </button>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon tasks-icon">
                        <i class="fas fa-list-check"></i>
                    </div>
                    <h3 class="card-title">Action Checklist</h3>
                </div>
                <div class="checklist">
                    ${this.renderActionChecklist()}
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon finance-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h3 class="card-title">Learning Resources</h3>
                </div>
                <div class="card-content">
                    ${this.renderLearningResources()}
                </div>
            </div>
        `;
    }

    renderRiskAssessment() {
        return `
            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon warning-icon" style="background: linear-gradient(135deg, #FB8C00, #FFB74D);">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <h3 class="card-title">Risk Assessment</h3>
                </div>
                <div class="card-content">
                    <p>Complete a quick assessment to receive personalized investment recommendations based on your risk tolerance.</p>
                </div>
                <form id="riskAssessmentForm" style="padding: 1rem;">
                    <div class="form-group">
                        <label>Investment Time Horizon</label>
                        <select class="form-select" id="timeHorizon" required>
                            <option value="">Select...</option>
                            <option value="short">Less than 3 years</option>
                            <option value="medium">3-10 years</option>
                            <option value="long">More than 10 years</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Risk Tolerance</label>
                        <select class="form-select" id="riskTolerance" required>
                            <option value="">Select...</option>
                            <option value="conservative">Conservative - Prefer stable, lower returns</option>
                            <option value="moderate">Moderate - Balance risk and return</option>
                            <option value="aggressive">Aggressive - Seek high returns, accept volatility</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-check"></i> Complete Assessment
                    </button>
                </form>
            </div>
        `;
    }

    renderInvestmentStrategy() {
        if (!this.riskProfile) {
            return '<p>Complete the risk assessment to get your personalized strategy.</p>';
        }

        const strategies = {
            conservative: {
                allocation: 'Bonds: 60%, Stocks: 30%, Cash: 10%',
                focus: 'Capital preservation and steady income',
                tips: ['Focus on blue-chip dividend stocks', 'Consider bond funds and ETFs', 'Maintain emergency cash reserves']
            },
            moderate: {
                allocation: 'Stocks: 50%, Bonds: 40%, Alternatives: 10%',
                focus: 'Balanced growth with moderate risk',
                tips: ['Diversify across sectors and regions', 'Mix growth and value stocks', 'Include some international exposure']
            },
            aggressive: {
                allocation: 'Stocks: 80%, Alternatives: 15%, Cash: 5%',
                focus: 'Maximum growth potential',
                tips: ['Consider growth stocks and tech sector', 'Explore emerging markets', 'Look into alternative investments']
            }
        };

        const strategy = strategies[this.riskProfile];
        return `
            <p><strong>Recommended Allocation:</strong><br>${strategy.allocation}</p>
            <p><strong>Focus:</strong> ${strategy.focus}</p>
            <p><strong>Key Tips:</strong></p>
            <ul>
                ${strategy.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
    }

    renderGoals() {
        if (this.goals.length === 0) {
            return '<p class="empty-state-text">No investment goals set yet</p>';
        }

        return this.goals.map(goal => `
            <div class="progress-container" style="margin-bottom: 1.5rem;">
                <div class="progress-label">
                    <span><strong>${goal.name}</strong></span>
                    <span>${window.MoneyCareerApp.formatCurrency(goal.current)} / ${window.MoneyCareerApp.formatCurrency(goal.target)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(goal.current / goal.target * 100)}%"></div>
                </div>
                <small style="color: var(--neutral-medium);">Target: ${goal.deadline}</small>
            </div>
        `).join('');
    }

    renderActionChecklist() {
        const actions = [
            { id: 1, text: 'Open an investment account', completed: false },
            { id: 2, text: 'Complete risk assessment', completed: !!this.riskProfile },
            { id: 3, text: 'Set up automatic contributions', completed: false },
            { id: 4, text: 'Diversify portfolio across asset classes', completed: false },
            { id: 5, text: 'Review portfolio quarterly', completed: false },
            { id: 6, text: 'Rebalance portfolio annually', completed: false }
        ];

        return actions.map(action => `
            <div class="checklist-item ${action.completed ? 'completed' : ''}">
                <input type="checkbox" class="checklist-checkbox" ${action.completed ? 'checked' : ''} 
                       onchange="investingModule.toggleAction(${action.id})">
                <span class="checklist-text">${action.text}</span>
            </div>
        `).join('');
    }

    renderLearningResources() {
        const resources = [
            { title: 'Understanding Stock Market Basics', icon: 'book', type: 'Article' },
            { title: 'ETFs vs Mutual Funds', icon: 'chart-line', type: 'Guide' },
            { title: 'Retirement Planning 101', icon: 'piggy-bank', type: 'Course' },
            { title: 'Tax-Efficient Investing', icon: 'file-invoice-dollar', type: 'Video' }
        ];

        return `
            <div class="card-grid">
                ${resources.map(resource => `
                    <div class="info-card">
                        <i class="fas fa-${resource.icon}" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                        <h4>${resource.title}</h4>
                        <span class="tag tag-secondary">${resource.type}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        setTimeout(() => {
            const form = document.getElementById('riskAssessmentForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.completeRiskAssessment();
                });
            }
        }, 100);
    }

    completeRiskAssessment() {
        const riskTolerance = document.getElementById('riskTolerance').value;
        this.riskProfile = riskTolerance;
        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Risk assessment completed! Your personalized strategy is ready.');
    }

    calculatePortfolioValue() {
        return this.portfolio.reduce((total, holding) => total + holding.value, 0);
    }

    calculateTotalGains() {
        return this.portfolio.reduce((total, holding) => {
            const gain = holding.value - holding.cost;
            return total + gain;
        }, 0);
    }

    calculateDiversification() {
        // Simplified diversification score
        const assetTypes = new Set(this.portfolio.map(h => h.type));
        return Math.min(assetTypes.size * 2, 10);
    }

    getRiskLevel() {
        const levels = {
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive'
        };
        return levels[this.riskProfile] || 'Not Set';
    }

    toggleAction(actionId) {
        window.MoneyCareerApp.showAlert('success', 'Progress updated!');
    }

    addGoal() {
        const name = prompt('Goal name (e.g., "House Down Payment"):');
        if (!name) return;

        const target = parseFloat(prompt('Target amount:'));
        if (!target || isNaN(target)) return;

        const deadline = prompt('Target date (e.g., "2028"):');
        if (!deadline) return;

        this.goals.push({
            id: Date.now(),
            name,
            target,
            current: 0,
            deadline
        });

        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Investment goal added!');
    }

    getPersonalizedAdvice() {
        window.MoneyCareerApp.showAlert('info', 'Opening AI Assistant for personalized investment advice...');
        window.MoneyCareerApp.openChatbot();
    }
}

// Initialize module if on investing page
if (window.location.pathname.includes('investing')) {
    const investingModule = new InvestingModule();
    window.investingModule = investingModule;
}
