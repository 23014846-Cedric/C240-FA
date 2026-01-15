// ========================================
// Finance Tracking Module
// ========================================

class FinanceModule {
    constructor() {
        this.expenses = [];
        this.budget = {};
        this.savings = [];
        this.init();
    }

    init() {
        this.loadData();
        this.renderDashboard();
        this.attachEventListeners();
    }

    loadData() {
        this.expenses = window.MoneyCareerApp.getFromLocalStorage('expenses') || [];
        this.budget = window.MoneyCareerApp.getFromLocalStorage('budget') || {};
        this.savings = window.MoneyCareerApp.getFromLocalStorage('savings') || [];
    }

    saveData() {
        window.MoneyCareerApp.saveToLocalStorage('expenses', this.expenses);
        window.MoneyCareerApp.saveToLocalStorage('budget', this.budget);
        window.MoneyCareerApp.saveToLocalStorage('savings', this.savings);
    }

    renderDashboard() {
        const container = document.getElementById('moduleContainer');
        if (!container) return;

        const totalExpenses = this.calculateTotalExpenses();
        const totalBudget = this.calculateTotalBudget();
        const totalSavings = this.calculateTotalSavings();
        const savingsRate = totalBudget > 0 ? totalSavings / totalBudget : 0;

        container.innerHTML = `
            <div class="module-dashboard">
                <div class="stat-card">
                    <div class="stat-value">${window.MoneyCareerApp.formatCurrency(totalExpenses)}</div>
                    <div class="stat-label">Total Expenses</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #1565C0, #1976D2);">
                    <div class="stat-value">${window.MoneyCareerApp.formatCurrency(totalBudget)}</div>
                    <div class="stat-label">Monthly Budget</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #43A047, #66BB6A);">
                    <div class="stat-value">${window.MoneyCareerApp.formatCurrency(totalSavings)}</div>
                    <div class="stat-label">Total Savings</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #FFA726, #FFB74D);">
                    <div class="stat-value">${window.MoneyCareerApp.formatPercentage(savingsRate)}</div>
                    <div class="stat-label">Savings Rate</div>
                </div>
            </div>

            <div class="card-grid">
                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon finance-icon">
                            <i class="fas fa-plus"></i>
                        </div>
                        <h3 class="card-title">Add Expense</h3>
                    </div>
                    <form id="expenseForm" class="module-form">
                        <div class="form-group">
                            <label for="expenseDescription">Description</label>
                            <input type="text" id="expenseDescription" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="expenseAmount">Amount</label>
                            <input type="number" id="expenseAmount" class="form-input" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="expenseCategory">Category</label>
                            <select id="expenseCategory" class="form-select" required>
                                <option value="">Select category</option>
                                <option value="food">Food & Dining</option>
                                <option value="transport">Transportation</option>
                                <option value="housing">Housing</option>
                                <option value="utilities">Utilities</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Add Expense
                        </button>
                    </form>
                </div>

                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon investing-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <h3 class="card-title">Expense Breakdown</h3>
                    </div>
                    <div id="expenseBreakdown">
                        ${this.renderExpenseBreakdown()}
                    </div>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon career-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3 class="card-title">AI Recommendations</h3>
                </div>
                <div class="card-content">
                    ${this.generateRecommendations()}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-success" onclick="financeModule.exportData()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                    <button class="btn btn-info" onclick="financeModule.getDetailedAnalysis()">
                        <i class="fas fa-chart-line"></i> Get Analysis
                    </button>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon tasks-icon">
                        <i class="fas fa-list"></i>
                    </div>
                    <h3 class="card-title">Recent Expenses</h3>
                </div>
                ${this.renderRecentExpenses()}
            </div>
        `;
    }

    renderExpenseBreakdown() {
        const categories = this.getExpensesByCategory();
        if (Object.keys(categories).length === 0) {
            return '<p class="empty-state-text">No expenses recorded yet</p>';
        }

        return Object.entries(categories)
            .map(([category, amount]) => {
                const percentage = this.calculateTotalExpenses() > 0 
                    ? amount / this.calculateTotalExpenses() 
                    : 0;
                return `
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>${this.formatCategoryName(category)}</span>
                            <span>${window.MoneyCareerApp.formatCurrency(amount)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage * 100}%"></div>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    renderRecentExpenses() {
        if (this.expenses.length === 0) {
            return '<p class="empty-state-text">No expenses to display</p>';
        }

        const recentExpenses = this.expenses.slice(-10).reverse();
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentExpenses.map((expense, index) => `
                        <tr>
                            <td>${window.MoneyCareerApp.formatDate(expense.date)}</td>
                            <td>${expense.description}</td>
                            <td><span class="tag tag-primary">${this.formatCategoryName(expense.category)}</span></td>
                            <td>${window.MoneyCareerApp.formatCurrency(expense.amount)}</td>
                            <td>
                                <button class="btn-action btn-warning" onclick="financeModule.deleteExpense(${this.expenses.length - 1 - index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    attachEventListeners() {
        // Wait for DOM to be ready
        setTimeout(() => {
            const form = document.getElementById('expenseForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addExpense();
                });
            }
        }, 100);
    }

    addExpense() {
        const description = document.getElementById('expenseDescription').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;

        const expense = {
            id: Date.now(),
            description,
            amount,
            category,
            date: new Date().toISOString()
        };

        this.expenses.push(expense);
        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Expense added successfully!');
    }

    deleteExpense(index) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses.splice(index, 1);
            this.saveData();
            this.renderDashboard();
            window.MoneyCareerApp.showAlert('success', 'Expense deleted successfully!');
        }
    }

    calculateTotalExpenses() {
        return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    calculateTotalBudget() {
        return Object.values(this.budget).reduce((total, amount) => total + amount, 0) || 3000;
    }

    calculateTotalSavings() {
        return this.savings.reduce((total, saving) => total + saving.amount, 0);
    }

    getExpensesByCategory() {
        return this.expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});
    }

    formatCategoryName(category) {
        const names = {
            food: 'Food & Dining',
            transport: 'Transportation',
            housing: 'Housing',
            utilities: 'Utilities',
            entertainment: 'Entertainment',
            healthcare: 'Healthcare',
            other: 'Other'
        };
        return names[category] || category;
    }

    generateRecommendations() {
        const recommendations = [
            '💡 Track your daily expenses to identify spending patterns',
            '💰 Set aside 20% of your income for savings and investments',
            '📊 Review your budget monthly and adjust as needed',
            '🎯 Create an emergency fund covering 3-6 months of expenses',
            '🔍 Look for recurring subscriptions you can cancel'
        ];

        return `
            <ul style="list-style: none; padding: 0;">
                ${recommendations.map(rec => `<li style="padding: 0.5rem 0;">${rec}</li>`).join('')}
            </ul>
        `;
    }

    exportData() {
        const data = {
            expenses: this.expenses,
            budget: this.budget,
            savings: this.savings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        window.MoneyCareerApp.showAlert('success', 'Data exported successfully!');
    }

    getDetailedAnalysis() {
        window.MoneyCareerApp.showAlert('info', 'Opening AI Assistant for detailed analysis...');
        window.MoneyCareerApp.openChatbot();
    }
}

// Initialize module if on finance page
if (window.location.pathname.includes('finance')) {
    const financeModule = new FinanceModule();
    window.financeModule = financeModule;
}
