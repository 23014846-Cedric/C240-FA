// ========================================
// Meeting Follow-ups Module
// ========================================

class MeetingsModule {
    constructor() {
        this.meetings = [];
        this.actionItems = [];
        this.init();
    }

    init() {
        this.loadData();
        this.renderDashboard();
        this.attachEventListeners();
    }

    loadData() {
        this.meetings = window.MoneyCareerApp.getFromLocalStorage('meetings') || [];
        this.actionItems = window.MoneyCareerApp.getFromLocalStorage('actionItems') || [];
    }

    saveData() {
        window.MoneyCareerApp.saveToLocalStorage('meetings', this.meetings);
        window.MoneyCareerApp.saveToLocalStorage('actionItems', this.actionItems);
    }

    renderDashboard() {
        const container = document.getElementById('moduleContainer');
        if (!container) return;

        const stats = this.calculateStats();

        container.innerHTML = `
            <div class="module-dashboard">
                <div class="stat-card" style="background: linear-gradient(135deg, #1565C0, #1976D2);">
                    <div class="stat-value">${stats.totalMeetings}</div>
                    <div class="stat-label">Total Meetings</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #FFA726, #FFB74D);">
                    <div class="stat-value">${stats.pendingActions}</div>
                    <div class="stat-label">Pending Actions</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #43A047, #66BB6A);">
                    <div class="stat-value">${stats.completedActions}</div>
                    <div class="stat-label">Completed Actions</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #2E7D32, #4CAF50);">
                    <div class="stat-value">${stats.followUpRate}%</div>
                    <div class="stat-label">Follow-up Rate</div>
                </div>
            </div>

            <div class="card-grid" style="margin-top: 2rem;">
                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon meetings-icon">
                            <i class="fas fa-calendar-plus"></i>
                        </div>
                        <h3 class="card-title">Log New Meeting</h3>
                    </div>
                    <form id="meetingForm" class="module-form">
                        <div class="form-group">
                            <label for="meetingTitle">Meeting Title</label>
                            <input type="text" id="meetingTitle" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="meetingDate">Date</label>
                            <input type="date" id="meetingDate" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="meetingAttendees">Attendees (comma-separated)</label>
                            <input type="text" id="meetingAttendees" class="form-input" placeholder="John, Sarah, Mike">
                        </div>
                        <div class="form-group">
                            <label for="meetingNotes">Meeting Notes</label>
                            <textarea id="meetingNotes" class="form-textarea" rows="4"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Log Meeting
                        </button>
                    </form>
                </div>

                <div class="info-card">
                    <div class="card-header">
                        <div class="card-icon tasks-icon">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <h3 class="card-title">Quick Actions</h3>
                    </div>
                    <div class="action-buttons" style="flex-direction: column; align-items: stretch;">
                        <button class="btn btn-primary" onclick="meetingsModule.generateSummary()">
                            <i class="fas fa-file-alt"></i> Generate Meeting Summary
                        </button>
                        <button class="btn btn-success" onclick="meetingsModule.draftFollowUp()">
                            <i class="fas fa-envelope"></i> Draft Follow-up Email
                        </button>
                        <button class="btn btn-info" onclick="meetingsModule.exportMeetings()">
                            <i class="fas fa-download"></i> Export All Meetings
                        </button>
                    </div>
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon career-icon">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <h3 class="card-title">Action Items</h3>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="meetingsModule.addActionItem()" style="margin-bottom: 1rem;">
                        <i class="fas fa-plus"></i> Add Action Item
                    </button>
                    ${this.renderActionItems()}
                </div>
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon finance-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <h3 class="card-title">Meeting History</h3>
                </div>
                ${this.renderMeetingHistory()}
            </div>

            <div class="info-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <div class="card-icon investing-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3 class="card-title">Meeting Best Practices</h3>
                </div>
                <div class="card-content">
                    ${this.renderBestPractices()}
                </div>
            </div>
        `;
    }

    renderActionItems() {
        if (this.actionItems.length === 0) {
            return '<p class="empty-state-text">No action items yet. Add items to track follow-ups.</p>';
        }

        const pending = this.actionItems.filter(a => !a.completed);
        const completed = this.actionItems.filter(a => a.completed);

        return `
            <div>
                ${pending.length > 0 ? `
                    <h4 style="margin-bottom: 1rem; color: var(--neutral-dark);">
                        <i class="fas fa-clock"></i> Pending Actions
                    </h4>
                    <div class="checklist">
                        ${pending.map(action => `
                            <div class="checklist-item">
                                <input type="checkbox" class="checklist-checkbox" onchange="meetingsModule.toggleAction(${action.id})">
                                <div class="checklist-text" style="flex: 1;">
                                    <strong>${action.title}</strong>
                                    <br>
                                    <small style="color: var(--neutral-medium);">
                                        Assigned to: ${action.assignedTo} | 
                                        Meeting: ${action.meetingTitle} | 
                                        Due: ${window.MoneyCareerApp.formatDate(action.dueDate)}
                                    </small>
                                </div>
                                <button class="btn-action btn-warning" onclick="meetingsModule.deleteAction(${action.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${completed.length > 0 ? `
                    <h4 style="margin: 2rem 0 1rem; color: var(--neutral-medium);">
                        <i class="fas fa-check-circle"></i> Completed Actions
                    </h4>
                    <div class="checklist">
                        ${completed.map(action => `
                            <div class="checklist-item completed">
                                <input type="checkbox" class="checklist-checkbox" checked onchange="meetingsModule.toggleAction(${action.id})">
                                <div class="checklist-text">
                                    <strong>${action.title}</strong>
                                    <br>
                                    <small style="color: var(--neutral-medium);">
                                        Completed: ${window.MoneyCareerApp.formatDate(action.completedAt)}
                                    </small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderMeetingHistory() {
        if (this.meetings.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-calendar"></i></div>
                    <div class="empty-state-title">No Meetings Logged</div>
                    <p class="empty-state-text">Start logging meetings to track discussions and action items</p>
                </div>
            `;
        }

        const sortedMeetings = [...this.meetings].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        return `
            <div class="timeline">
                ${sortedMeetings.map(meeting => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-date">${window.MoneyCareerApp.formatDate(meeting.date)}</div>
                            <div class="timeline-title">${meeting.title}</div>
                            ${meeting.attendees ? `
                                <p style="color: var(--neutral-medium); margin: 0.5rem 0;">
                                    <i class="fas fa-users"></i> ${meeting.attendees}
                                </p>
                            ` : ''}
                            ${meeting.notes ? `
                                <p style="margin: 0.5rem 0;">${meeting.notes}</p>
                            ` : ''}
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="btn-action btn-info" onclick="meetingsModule.viewMeeting(${meeting.id})">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="btn-action btn-success" onclick="meetingsModule.generateSummaryForMeeting(${meeting.id})">
                                    <i class="fas fa-file-alt"></i> Summary
                                </button>
                                <button class="btn-action btn-warning" onclick="meetingsModule.deleteMeeting(${meeting.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderBestPractices() {
        const practices = [
            {
                icon: 'clipboard-list',
                title: 'Set Clear Agenda',
                description: 'Share meeting objectives and topics in advance'
            },
            {
                icon: 'clock',
                title: 'Respect Time',
                description: 'Start and end on time to respect everyone\'s schedule'
            },
            {
                icon: 'list-check',
                title: 'Document Action Items',
                description: 'Clearly assign tasks with deadlines and owners'
            },
            {
                icon: 'paper-plane',
                title: 'Send Follow-ups',
                description: 'Share meeting notes and action items within 24 hours'
            }
        ];

        return `
            <div class="card-grid">
                ${practices.map(practice => `
                    <div style="padding: 1rem; background: var(--neutral-bg); border-radius: var(--radius-md);">
                        <i class="fas fa-${practice.icon}" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                        <h4 style="margin-bottom: 0.5rem;">${practice.title}</h4>
                        <p style="color: var(--neutral-medium); font-size: 0.875rem;">${practice.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        setTimeout(() => {
            const form = document.getElementById('meetingForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.logMeeting();
                });
            }
        }, 100);
    }

    logMeeting() {
        const title = document.getElementById('meetingTitle').value;
        const date = document.getElementById('meetingDate').value;
        const attendees = document.getElementById('meetingAttendees').value;
        const notes = document.getElementById('meetingNotes').value;

        const meeting = {
            id: Date.now(),
            title,
            date,
            attendees,
            notes,
            createdAt: new Date().toISOString()
        };

        this.meetings.push(meeting);
        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Meeting logged successfully!');
    }

    addActionItem() {
        const title = prompt('Action item description:');
        if (!title) return;

        const assignedTo = prompt('Assigned to:');
        if (!assignedTo) return;

        const dueDate = prompt('Due date (YYYY-MM-DD):');
        if (!dueDate) return;

        const meetingTitle = prompt('Related meeting title (optional):') || 'General';

        const action = {
            id: Date.now(),
            title,
            assignedTo,
            dueDate,
            meetingTitle,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.actionItems.push(action);
        this.saveData();
        this.renderDashboard();
        window.MoneyCareerApp.showAlert('success', 'Action item added!');
    }

    toggleAction(actionId) {
        const action = this.actionItems.find(a => a.id === actionId);
        if (action) {
            action.completed = !action.completed;
            action.completedAt = action.completed ? new Date().toISOString() : null;
            this.saveData();
            this.renderDashboard();
            
            if (action.completed) {
                window.MoneyCareerApp.showAlert('success', '🎉 Action item completed!');
            }
        }
    }

    deleteAction(actionId) {
        if (confirm('Delete this action item?')) {
            this.actionItems = this.actionItems.filter(a => a.id !== actionId);
            this.saveData();
            this.renderDashboard();
            window.MoneyCareerApp.showAlert('success', 'Action item deleted!');
        }
    }

    deleteMeeting(meetingId) {
        if (confirm('Delete this meeting? This cannot be undone.')) {
            this.meetings = this.meetings.filter(m => m.id !== meetingId);
            this.saveData();
            this.renderDashboard();
            window.MoneyCareerApp.showAlert('success', 'Meeting deleted!');
        }
    }

    viewMeeting(meetingId) {
        const meeting = this.meetings.find(m => m.id === meetingId);
        if (meeting) {
            alert(`Meeting: ${meeting.title}\nDate: ${meeting.date}\nAttendees: ${meeting.attendees}\n\nNotes:\n${meeting.notes}`);
        }
    }

    calculateStats() {
        const totalMeetings = this.meetings.length;
        const pendingActions = this.actionItems.filter(a => !a.completed).length;
        const completedActions = this.actionItems.filter(a => a.completed).length;
        const followUpRate = this.actionItems.length > 0 
            ? Math.round((completedActions / this.actionItems.length) * 100) 
            : 0;

        return { totalMeetings, pendingActions, completedActions, followUpRate };
    }

    generateSummary() {
        window.MoneyCareerApp.showAlert('info', 'Opening AI Assistant to generate meeting summary...');
        window.MoneyCareerApp.openChatbot();
    }

    generateSummaryForMeeting(meetingId) {
        const meeting = this.meetings.find(m => m.id === meetingId);
        if (meeting) {
            window.MoneyCareerApp.showAlert('info', `Generating summary for "${meeting.title}"...`);
            window.MoneyCareerApp.openChatbot();
        }
    }

    draftFollowUp() {
        window.MoneyCareerApp.showAlert('info', 'Opening AI Assistant to draft follow-up email...');
        window.MoneyCareerApp.openChatbot();
    }

    exportMeetings() {
        const data = {
            meetings: this.meetings,
            actionItems: this.actionItems,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meetings-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        window.MoneyCareerApp.showAlert('success', 'Meetings exported successfully!');
    }
}

// Initialize module if on meetings page
if (window.location.pathname.includes('meetings')) {
    const meetingsModule = new MeetingsModule();
    window.meetingsModule = meetingsModule;
}
