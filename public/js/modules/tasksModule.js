// ========================================
// Task Prioritization Module
// ========================================

class TasksModule {
    constructor() {
        this.tasks = [];
        this.categories = ['Work', 'Personal', 'Learning', 'Health', 'Finance', 'Other'];
        this.priorities = ['High', 'Medium', 'Low'];
        this.init();
    }

    init() {
        this.loadData();
        this.renderDashboard();
        this.attachEventListeners();
    }

    loadData() {
        this.tasks = window.MoneyCareerApp.getFromLocalStorage('tasks') || [];
    }

    saveData() {
        window.MoneyCareerApp.saveToLocalStorage('tasks', this.tasks);
    }

    renderDashboard() {
        const container = document.getElementById('moduleContainer');
        if (!container) return;

        const stats = this.calculateStats();

        container.innerHTML = `
            <div class="module-dashboard">
                <div class="stat-card" style="background: linear-gradient(135deg, #1565C0, #1976D2);">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Total Tasks</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #FFA726, #FFB74D);">
                    <div class="stat-value">${stats.pending}</div>
                    <div class="stat-label">Pending Tasks</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #43A047, #66BB6A);">
                    <div class="stat-value">${stats.completed}</div>
                    <div class="stat-label">Completed Today</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #2E7D32, #4CAF50);">
                    <div class="stat-value">${stats.productivity}%</div>
                    <div class="stat-label">Productivity Score</div>
                </div>
            </div>

            <div class="card-grid" style="margin-top: 2rem;">
                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon tasks-icon">
                            <i class="fas fa-plus-circle"></i>
                        </div>
                        <h3 class="card-title">Add New Task</h3>
                    </div>
                    <form id="taskForm" class="module-form">
                        <div class="form-group">
                            <label for="taskTitle">Task Title</label>
                            <input type="text" id="taskTitle" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="taskDescription">Description</label>
                            <textarea id="taskDescription" class="form-textarea" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="taskPriority">Priority</label>
                            <select id="taskPriority" class="form-select" required>
                                <option value="">Select priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="taskCategory">Category</label>
                            <select id="taskCategory" class="form-select" required>
                                <option value="">Select category</option>
                                ${this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="taskDueDate">Due Date</label>
                            <input type="date" id="taskDueDate" class="form-input">
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Add Task
                        </button>
                    </form>
                </div>

                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon career-icon">
                            <i class="fas fa-fire"></i>
                        </div>
                        <h3 class="card-title">Today's Focus</h3>
                    </div>
                    <div class="card-content">
                        ${this.renderTodaysFocus()}
                    </div>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon finance-icon">
                        <i class="fas fa-list"></i>
                    </div>
                    <h3 class="card-title">All Tasks</h3>
                </div>
                <div style="margin-bottom: 1rem;">
                    <select id="filterPriority" class="form-select" style="display: inline-block; width: auto; margin-right: 1rem;" onchange="tasksModule.filterTasks()">
                        <option value="">All Priorities</option>
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                    </select>
                    <select id="filterCategory" class="form-select" style="display: inline-block; width: auto;" onchange="tasksModule.filterTasks()">
                        <option value="">All Categories</option>
                        ${this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                <div id="tasksList">
                    ${this.renderTasksList()}
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon investing-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3 class="card-title">AI Productivity Tips</h3>
                </div>
                <div class="card-content">
                    ${this.renderProductivityTips()}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="tasksModule.getAIPrioritization()">
                        <i class="fas fa-robot"></i> Get AI Prioritization
                    </button>
                    <button class="btn btn-success" onclick="tasksModule.exportTasks()">
                        <i class="fas fa-download"></i> Export Tasks
                    </button>
                </div>
            </div>
        `;
    }

    renderTodaysFocus() {
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = this.tasks.filter(t => 
            !t.completed && (!t.dueDate || t.dueDate >= today)
        ).slice(0, 5);

        if (todayTasks.length === 0) {
            return '<p class="empty-state-text">No tasks for today. Add some to get started!</p>';
        }

        // Sort by priority
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        todayTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        return `
            <div class="checklist">
                ${todayTasks.map((task, index) => `
                    <div class="checklist-item" style="border-left: 4px solid ${this.getPriorityColor(task.priority)};">
                        <input type="checkbox" class="checklist-checkbox" onchange="tasksModule.toggleTask(${task.id})">
                        <div class="checklist-text">
                            <strong>${task.title}</strong>
                            <br>
                            <small style="color: var(--neutral-medium);">${task.category}</small>
                        </div>
                        <span class="tag tag-${task.priority === 'High' ? 'accent' : task.priority === 'Medium' ? 'secondary' : 'primary'}">${task.priority}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTasksList() {
        if (this.tasks.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-clipboard-list"></i></div>
                    <div class="empty-state-title">No Tasks Yet</div>
                    <p class="empty-state-text">Start by adding your first task</p>
                </div>
            `;
        }

        // Separate completed and pending tasks
        const pending = this.tasks.filter(t => !t.completed);
        const completed = this.tasks.filter(t => t.completed);

        return `
            <div>
                ${pending.length > 0 ? `
                    <h4 style="margin-bottom: 1rem; color: var(--neutral-dark);">
                        <i class="fas fa-clock"></i> Pending (${pending.length})
                    </h4>
                    ${pending.map(task => this.renderTaskCard(task)).join('')}
                ` : ''}
                
                ${completed.length > 0 ? `
                    <h4 style="margin: 2rem 0 1rem; color: var(--neutral-medium);">
                        <i class="fas fa-check-circle"></i> Completed (${completed.length})
                    </h4>
                    ${completed.map(task => this.renderTaskCard(task)).join('')}
                ` : ''}
            </div>
        `;
    }

    renderTaskCard(task) {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        
        return `
            <div class="info-card" style="margin-bottom: 1rem; ${task.completed ? 'opacity: 0.6;' : ''} border-left: 4px solid ${this.getPriorityColor(task.priority)};">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                                   onchange="tasksModule.toggleTask(${task.id})"
                                   style="width: 20px; height: 20px; cursor: pointer;">
                            <h4 style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.title}</h4>
                        </div>
                        ${task.description ? `<p style="color: var(--neutral-medium); margin-left: 2rem;">${task.description}</p>` : ''}
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; margin-left: 2rem; flex-wrap: wrap;">
                            <span class="tag tag-${task.priority === 'High' ? 'accent' : task.priority === 'Medium' ? 'secondary' : 'primary'}">
                                ${task.priority}
                            </span>
                            <span class="tag tag-secondary">${task.category}</span>
                            ${task.dueDate ? `
                                <span class="tag ${isOverdue ? 'tag-accent' : 'tag-primary'}">
                                    <i class="fas fa-calendar"></i> ${window.MoneyCareerApp.formatDate(task.dueDate)}
                                    ${isOverdue ? ' (Overdue)' : ''}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <button class="btn-action btn-warning" onclick="tasksModule.deleteTask(${task.id})" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderProductivityTips() {
        const tips = [
            {
                icon: 'clock',
                title: 'Time Blocking',
                description: 'Allocate specific time blocks for high-priority tasks'
            },
            {
                icon: 'list-check',
                title: 'Eisenhower Matrix',
                description: 'Categorize tasks by urgency and importance'
            },
            {
                icon: 'battery-three-quarters',
                title: 'Energy Management',
                description: 'Do difficult tasks when your energy is highest'
            },
            {
                icon: 'ban',
                title: 'Minimize Distractions',
                description: 'Turn off notifications during focus time'
            }
        ];

        return `
            <div class="card-grid">
                ${tips.map(tip => `
                    <div style="padding: 1rem; background: var(--neutral-bg); border-radius: var(--radius-md);">
                        <i class="fas fa-${tip.icon}" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                        <h4 style="margin-bottom: 0.5rem;">${tip.title}</h4>
                        <p style="color: var(--neutral-medium); font-size: 0.875rem;">${tip.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        setTimeout(() => {
            const form = document.getElementById('taskForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addTask();
                });
            }
        }, 100);
    }

    addTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const category = document.getElementById('taskCategory').value;
        const dueDate = document.getElementById('taskDueDate').value;

        const task = {
            id: Date.now(),
            title,
            description,
            priority,
            category,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Task added successfully!');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveData();
            this.renderDashboard();
            
            if (task.completed) {
                window.MoneyCareerApp.showAlert('success', '🎉 Task completed! Great job!');
            }
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveData();
            this.renderDashboard();
            window.MoneyCareerApp.showAlert('success', 'Task deleted successfully!');
        }
    }

    filterTasks() {
        const priorityFilter = document.getElementById('filterPriority').value;
        const categoryFilter = document.getElementById('filterCategory').value;

        let filtered = this.tasks;

        if (priorityFilter) {
            filtered = filtered.filter(t => t.priority === priorityFilter);
        }

        if (categoryFilter) {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        // Temporarily update tasks for rendering
        const originalTasks = this.tasks;
        this.tasks = filtered;
        
        const tasksList = document.getElementById('tasksList');
        if (tasksList) {
            tasksList.innerHTML = this.renderTasksList();
        }

        this.tasks = originalTasks;
    }

    calculateStats() {
        const total = this.tasks.length;
        const pending = this.tasks.filter(t => !t.completed).length;
        
        const today = new Date().toISOString().split('T')[0];
        const completed = this.tasks.filter(t => 
            t.completed && t.completedAt && t.completedAt.startsWith(today)
        ).length;

        const productivity = total > 0 ? Math.round((this.tasks.filter(t => t.completed).length / total) * 100) : 0;

        return { total, pending, completed, productivity };
    }

    getPriorityColor(priority) {
        const colors = {
            'High': '#FB8C00',
            'Medium': '#1565C0',
            'Low': '#43A047'
        };
        return colors[priority] || '#546E7A';
    }

    getAIPrioritization() {
        window.MoneyCareerApp.showAlert('info', 'Opening AI Assistant for smart task prioritization...');
        window.MoneyCareerApp.openChatbot();
    }

    exportTasks() {
        const data = {
            tasks: this.tasks,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        window.MoneyCareerApp.showAlert('success', 'Tasks exported successfully!');
    }
}

// Initialize module if on tasks page
if (window.location.pathname.includes('tasks')) {
    const tasksModule = new TasksModule();
    window.tasksModule = tasksModule;
}
