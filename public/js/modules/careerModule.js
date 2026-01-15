// ========================================
// Career Transformation Module
// Step-by-step wizard to collect user info and generate personalized career plan
// ========================================

class CareerModule {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        
        this.userData = {
            // Step 1: Background
            educationLevel: '',
            currentRole: '',
            yearsExperience: 0,
            certifications: [],
            
            // Step 2: Skills
            technicalSkills: [],
            softSkills: [],
            
            // Step 3: Career Goals
            targetRoles: [],
            preferredIndustry: '',
            preferredLocation: '',
            shortTermGoals: '',
            longTermGoals: '',
            
            // Generated outputs
            generatedResults: null
        };
        
        this.roleRequirements = this.loadRoleRequirements();
        this.init();
    }

    init() {
        this.loadData();
        this.renderDashboard();
    }

    loadData() {
        const saved = window.MoneyCareerApp.getFromLocalStorage('careerUserData');
        if (saved) {
            this.userData = saved;
        }
    }

    saveData() {
        window.MoneyCareerApp.saveToLocalStorage('careerUserData', this.userData);
    }

    loadRoleRequirements() {
        return {
            'Software Engineer': {
                technical: ['JavaScript', 'HTML/CSS', 'Git', 'REST APIs', 'React or Vue', 'Node.js or Python', 'SQL or MongoDB'],
                soft: ['Problem Solving', 'Communication', 'Teamwork', 'Time Management', 'Adaptability'],
                typical_experience: '0-2 years',
                education: 'Degree in Computer Science or related field (or equivalent experience)'
            },
            'Senior Software Engineer': {
                technical: ['JavaScript', 'Python or Java', 'System Design', 'AWS or Azure', 'Microservices', 'Git', 'CI/CD', 'Docker'],
                soft: ['Leadership', 'Mentoring', 'Communication', 'Problem Solving', 'Decision Making', 'Strategic Thinking'],
                typical_experience: '3-6 years',
                education: 'Degree in Computer Science or related field'
            },
            'Data Scientist': {
                technical: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Pandas/NumPy', 'Jupyter', 'TensorFlow or PyTorch'],
                soft: ['Analytical Thinking', 'Communication', 'Problem Solving', 'Attention to Detail', 'Curiosity'],
                typical_experience: '1-3 years',
                education: 'Degree in Data Science, Statistics, Computer Science, or related field'
            },
            'Product Manager': {
                technical: ['Product Strategy', 'Data Analysis', 'SQL (optional)', 'Roadmapping Tools', 'Analytics Tools', 'Agile/Scrum'],
                soft: ['Leadership', 'Communication', 'Strategic Thinking', 'Stakeholder Management', 'Decision Making', 'Empathy'],
                typical_experience: '2-5 years',
                education: 'Any degree with business/tech understanding'
            },
            'UX Designer': {
                technical: ['Figma or Sketch', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems', 'HTML/CSS (optional)'],
                soft: ['Creativity', 'Communication', 'Empathy', 'Problem Solving', 'Collaboration', 'Attention to Detail'],
                typical_experience: '1-3 years',
                education: 'Degree in Design, HCI, Psychology, or related field'
            },
            'Frontend Developer': {
                technical: ['HTML', 'CSS', 'JavaScript', 'React or Vue or Angular', 'Responsive Design', 'Git', 'REST APIs', 'CSS Frameworks'],
                soft: ['Attention to Detail', 'Problem Solving', 'Communication', 'Teamwork', 'Creativity'],
                typical_experience: '0-2 years',
                education: 'Degree or bootcamp in Web Development or Computer Science'
            },
            'DevOps Engineer': {
                technical: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS or Azure or GCP', 'Scripting (Bash/Python)', 'Git', 'Terraform'],
                soft: ['Problem Solving', 'Communication', 'Automation Mindset', 'Collaboration', 'Attention to Detail'],
                typical_experience: '2-4 years',
                education: 'Degree in Computer Science or IT'
            },
            'Business Analyst': {
                technical: ['SQL', 'Excel', 'Data Analysis', 'Requirements Gathering', 'Documentation', 'BI Tools', 'Process Modeling'],
                soft: ['Analytical Thinking', 'Communication', 'Problem Solving', 'Stakeholder Management', 'Critical Thinking'],
                typical_experience: '1-3 years',
                education: 'Any degree with analytical background'
            },
            'Marketing Specialist': {
                technical: ['Content Marketing', 'SEO', 'Social Media', 'Google Analytics', 'Email Marketing', 'CRM Tools'],
                soft: ['Creativity', 'Communication', 'Strategic Thinking', 'Adaptability', 'Data-driven mindset'],
                typical_experience: '1-3 years',
                education: 'Degree in Marketing, Communications, or related field'
            },
            'Data Analyst': {
                technical: ['SQL', 'Excel', 'Python or R', 'Data Visualization', 'Tableau or Power BI', 'Statistics'],
                soft: ['Analytical Thinking', 'Communication', 'Attention to Detail', 'Problem Solving', 'Curiosity'],
                typical_experience: '0-2 years',
                education: 'Degree in Data Analytics, Statistics, or related field'
            }
        };
    }

    renderDashboard() {
        const container = document.getElementById('moduleContainer');
        if (!container) return;
        
        if (!this.userData.generatedResults) {
            // Show wizard
            this.renderWizard();
        } else {
            // Show complete dashboard
            this.renderCompleteDashboard();
        }
    }

    renderWizard() {
        const container = document.getElementById('moduleContainer');
        
        container.innerHTML = `
            <div class="career-wizard">
                <div class="wizard-header">
                    <h1><i class="fas fa-compass"></i> Career Transformation Journey</h1>
                    <p>Let's build your personalized career roadmap step by step</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                    </div>
                    <p class="step-indicator">Step ${this.currentStep} of ${this.totalSteps}</p>
                </div>
                
                <div class="wizard-content">
                    ${this.renderCurrentStep()}
                </div>
                
                <div class="wizard-nav">
                    ${this.currentStep > 1 ? `
                        <button onclick="careerModule.previousStep()" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    ` : '<div></div>'}
                    
                    ${this.currentStep < this.totalSteps ? `
                        <button onclick="careerModule.nextStep()" class="btn btn-primary">
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                    ` : `
                        <button onclick="careerModule.generateCareerPlan()" class="btn btn-primary btn-large">
                            <i class="fas fa-magic"></i> Generate My Career Plan
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    renderCurrentStep() {
        switch(this.currentStep) {
            case 1: return this.renderStep1();
            case 2: return this.renderStep2();
            case 3: return this.renderStep3();
            case 4: return this.renderStep4();
            default: return '';
        }
    }

    renderStep1() {
        return `
            <div class="wizard-step" id="step1">
                <h2><i class="fas fa-user-graduate"></i> Your Background</h2>
                <p class="step-description">Tell us about your current education and career stage</p>
                
                <div class="form-group">
                    <label for="educationLevel">Education Level / Career Stage *</label>
                    <select id="educationLevel" class="form-control">
                        <option value="">Select your current stage...</option>
                        <option value="Student" ${this.userData.educationLevel === 'Student' ? 'selected' : ''}>Student</option>
                        <option value="Diploma Holder" ${this.userData.educationLevel === 'Diploma Holder' ? 'selected' : ''}>Diploma Holder</option>
                        <option value="Degree Holder" ${this.userData.educationLevel === 'Degree Holder' ? 'selected' : ''}>Degree Holder</option>
                        <option value="Masters/PhD" ${this.userData.educationLevel === 'Masters/PhD' ? 'selected' : ''}>Masters/PhD</option>
                        <option value="Working Professional" ${this.userData.educationLevel === 'Working Professional' ? 'selected' : ''}>Working Professional</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="currentRole">Current Field of Study / Job Title *</label>
                    <input type="text" id="currentRole" class="form-control" 
                           placeholder="e.g., Computer Science Student, Junior Developer, Marketing Intern"
                           value="${this.userData.currentRole || ''}">
                    <small>Be specific - this helps us understand your starting point</small>
                </div>
                
                <div class="form-group">
                    <label for="yearsExperience">Years of Experience</label>
                    <input type="number" id="yearsExperience" class="form-control" 
                           min="0" max="50" value="${this.userData.yearsExperience}">
                    <small>Enter 0 if you're a student or recent graduate</small>
                </div>
                
                <div class="form-group">
                    <label for="certificationsInput">Certifications / Completed Courses (optional)</label>
                    <textarea id="certificationsInput" class="form-control" rows="3" 
                              placeholder="e.g., AWS Certified Developer, Google Data Analytics Certificate, Harvard CS50">${this.userData.certifications.join(', ')}</textarea>
                    <small>Separate multiple items with commas</small>
                </div>
            </div>
        `;
    }

    renderStep2() {
        return `
            <div class="wizard-step" id="step2">
                <h2><i class="fas fa-tools"></i> Your Current Skills</h2>
                <p class="step-description">Rate your existing skills honestly - this creates an accurate roadmap</p>
                
                <div class="skills-section">
                    <h3>Technical Skills</h3>
                    <p>Programming languages, tools, frameworks, platforms you know</p>
                    <div id="technicalSkillsList" class="skills-list">
                        ${this.renderSkillsList('technical')}
                    </div>
                    <div class="skill-input-group">
                        <input type="text" id="newTechnicalSkill" class="form-control" placeholder="Skill name (e.g., JavaScript, Python, Excel)">
                        <select id="newTechnicalLevel" class="form-control">
                            <option value="">Proficiency Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <button onclick="careerModule.addSkill('technical')" class="btn btn-secondary">
                            <i class="fas fa-plus"></i> Add
                        </button>
                    </div>
                </div>
                
                <div class="skills-section">
                    <h3>Soft Skills</h3>
                    <p>Communication, leadership, teamwork, problem-solving abilities</p>
                    <div id="softSkillsList" class="skills-list">
                        ${this.renderSkillsList('soft')}
                    </div>
                    <div class="skill-input-group">
                        <input type="text" id="newSoftSkill" class="form-control" placeholder="Skill name (e.g., Communication, Leadership)">
                        <select id="newSoftLevel" class="form-control">
                            <option value="">Proficiency Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <button onclick="careerModule.addSkill('soft')" class="btn btn-secondary">
                            <i class="fas fa-plus"></i> Add
                        </button>
                    </div>
                </div>
                
                <div class="skill-guide">
                    <h4>💡 How to rate your skills:</h4>
                    <ul>
                        <li><strong>Beginner:</strong> Just started learning, need guidance for most tasks</li>
                        <li><strong>Intermediate:</strong> Comfortable with core concepts, can work independently</li>
                        <li><strong>Advanced:</strong> Expert level, can teach others and solve complex problems</li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderSkillsList(type) {
        const skills = type === 'technical' ? this.userData.technicalSkills : this.userData.softSkills;
        
        if (skills.length === 0) {
            return `<p class="empty-state">No ${type} skills added yet. Add some above!</p>`;
        }
        
        return skills.map((skill, index) => `
            <div class="skill-tag">
                <span><strong>${skill.name}</strong> - ${skill.level}</span>
                <button onclick="careerModule.removeSkill('${type}', ${index})" class="btn-icon" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    renderStep3() {
        return `
            <div class="wizard-step" id="step3">
                <h2><i class="fas fa-bullseye"></i> Your Career Goals</h2>
                <p class="step-description">What role(s) are you working towards?</p>
                
                <div class="form-group">
                    <label>Target Job Role(s) *</label>
                    <div class="role-grid">
                        ${Object.keys(this.roleRequirements).map(role => `
                            <label class="role-option">
                                <input type="checkbox" value="${role}" 
                                       ${this.userData.targetRoles.includes(role) ? 'checked' : ''}
                                       onchange="careerModule.toggleRole('${role}', this.checked)">
                                <span><i class="fas fa-briefcase"></i> ${role}</span>
                            </label>
                        `).join('')}
                    </div>
                    <small>Select one or more roles you're interested in</small>
                </div>
                
                <div class="form-group">
                    <label for="preferredIndustry">Preferred Industry (optional)</label>
                    <input type="text" id="preferredIndustry" class="form-control" 
                           placeholder="e.g., Fintech, Healthcare, E-commerce, Gaming, Education"
                           value="${this.userData.preferredIndustry || ''}">
                </div>
                
                <div class="form-group">
                    <label for="preferredLocation">Preferred Location (optional)</label>
                    <input type="text" id="preferredLocation" class="form-control" 
                           placeholder="e.g., Singapore, Remote, United States, Europe"
                           value="${this.userData.preferredLocation || ''}">
                </div>
                
                <div class="form-group">
                    <label for="shortTermGoals">Short-term Goals (Next 6-12 months) *</label>
                    <textarea id="shortTermGoals" class="form-control" rows="3"
                              placeholder="What do you want to achieve in the next year? Be specific.">${this.userData.shortTermGoals || ''}</textarea>
                    <small>Example: "Land my first junior developer role" or "Get promoted to senior analyst"</small>
                </div>
                
                <div class="form-group">
                    <label for="longTermGoals">Long-term Goals (3-5 years)</label>
                    <textarea id="longTermGoals" class="form-control" rows="3"
                              placeholder="Where do you see yourself in 3-5 years?">${this.userData.longTermGoals || ''}</textarea>
                    <small>Example: "Become a tech lead" or "Start my own consulting business"</small>
                </div>
            </div>
        `;
    }

    renderStep4() {
        const techCount = this.userData.technicalSkills.length;
        const softCount = this.userData.softSkills.length;
        const rolesCount = this.userData.targetRoles.length;
        
        return `
            <div class="wizard-step" id="step4">
                <h2><i class="fas fa-check-circle"></i> Review Your Information</h2>
                <p class="step-description">Please review everything before we generate your personalized plan</p>
                
                <div class="review-section">
                    <h3><i class="fas fa-user"></i> Background</h3>
                    <div class="review-content">
                        <p><strong>Education/Stage:</strong> ${this.userData.educationLevel || '<span class="missing">Not provided</span>'}</p>
                        <p><strong>Current Role:</strong> ${this.userData.currentRole || '<span class="missing">Not provided</span>'}</p>
                        <p><strong>Experience:</strong> ${this.userData.yearsExperience} year(s)</p>
                        ${this.userData.certifications.length > 0 ? `
                            <p><strong>Certifications:</strong> ${this.userData.certifications.join(', ')}</p>
                        ` : ''}
                    </div>
                </div>
                
                <div class="review-section">
                    <h3><i class="fas fa-tools"></i> Skills</h3>
                    <div class="review-content">
                        <p><strong>Technical Skills:</strong> ${techCount} skill(s) added</p>
                        ${techCount > 0 ? `
                            <div class="skills-preview">
                                ${this.userData.technicalSkills.slice(0, 5).map(s => `<span class="skill-badge">${s.name}</span>`).join('')}
                                ${techCount > 5 ? `<span class="skill-badge">+${techCount - 5} more</span>` : ''}
                            </div>
                        ` : '<p class="warning-text">⚠️ No technical skills added</p>'}
                        
                        <p style="margin-top: 1rem;"><strong>Soft Skills:</strong> ${softCount} skill(s) added</p>
                        ${softCount > 0 ? `
                            <div class="skills-preview">
                                ${this.userData.softSkills.slice(0, 5).map(s => `<span class="skill-badge">${s.name}</span>`).join('')}
                                ${softCount > 5 ? `<span class="skill-badge">+${softCount - 5} more</span>` : ''}
                            </div>
                        ` : '<p class="warning-text">⚠️ No soft skills added</p>'}
                    </div>
                </div>
                
                <div class="review-section">
                    <h3><i class="fas fa-bullseye"></i> Career Goals</h3>
                    <div class="review-content">
                        <p><strong>Target Roles:</strong> ${rolesCount > 0 ? this.userData.targetRoles.join(', ') : '<span class="missing">None selected</span>'}</p>
                        ${this.userData.preferredIndustry ? `<p><strong>Industry:</strong> ${this.userData.preferredIndustry}</p>` : ''}
                        ${this.userData.preferredLocation ? `<p><strong>Location:</strong> ${this.userData.preferredLocation}</p>` : ''}
                        <p><strong>Short-term Goals:</strong> ${this.userData.shortTermGoals || '<span class="missing">Not provided</span>'}</p>
                        ${this.userData.longTermGoals ? `<p><strong>Long-term Goals:</strong> ${this.userData.longTermGoals}</p>` : ''}
                    </div>
                </div>
                
                ${rolesCount === 0 || techCount === 0 ? `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Recommendation:</strong> For the best results, please add at least one target role and some technical skills.
                        You can go back to previous steps to add them.
                    </div>
                ` : `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i>
                        <strong>Ready to go!</strong> Your information looks good. Click "Generate My Career Plan" to see your personalized roadmap.
                    </div>
                `}
            </div>
        `;
    }

    // Navigation methods
    nextStep() {
        // Validate current step
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Save data from current step
        this.saveCurrentStepData();
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.renderWizard();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderWizard();
        }
    }

    validateCurrentStep() {
        switch(this.currentStep) {
            case 1:
                const education = document.getElementById('educationLevel')?.value;
                const role = document.getElementById('currentRole')?.value.trim();
                if (!education || !role) {
                    window.MoneyCareerApp.showAlert('Please fill in your education level and current role', 'warning');
                    return false;
                }
                return true;
            case 2:
                if (this.userData.technicalSkills.length === 0 && this.userData.softSkills.length === 0) {
                    const proceed = confirm('You haven\'t added any skills yet. Add at least a few skills for better results. Continue anyway?');
                    return proceed;
                }
                return true;
            case 3:
                const targetRoles = this.userData.targetRoles;
                const shortTerm = document.getElementById('shortTermGoals')?.value.trim();
                if (targetRoles.length === 0 || !shortTerm) {
                    window.MoneyCareerApp.showAlert('Please select at least one target role and describe your short-term goals', 'warning');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    saveCurrentStepData() {
        switch(this.currentStep) {
            case 1:
                this.userData.educationLevel = document.getElementById('educationLevel')?.value || '';
                this.userData.currentRole = document.getElementById('currentRole')?.value.trim() || '';
                this.userData.yearsExperience = parseInt(document.getElementById('yearsExperience')?.value || 0);
                const certs = document.getElementById('certificationsInput')?.value.trim() || '';
                this.userData.certifications = certs ? certs.split(',').map(c => c.trim()).filter(c => c) : [];
                break;
            case 2:
                // Skills are saved in real-time via addSkill/removeSkill
                break;
            case 3:
                this.userData.preferredIndustry = document.getElementById('preferredIndustry')?.value.trim() || '';
                this.userData.preferredLocation = document.getElementById('preferredLocation')?.value.trim() || '';
                this.userData.shortTermGoals = document.getElementById('shortTermGoals')?.value.trim() || '';
                this.userData.longTermGoals = document.getElementById('longTermGoals')?.value.trim() || '';
                break;
        }
        this.saveData();
    }

    // Skill management
    addSkill(type) {
        const nameId = type === 'technical' ? 'newTechnicalSkill' : 'newSoftSkill';
        const levelId = type === 'technical' ? 'newTechnicalLevel' : 'newSoftLevel';
        
        const name = document.getElementById(nameId)?.value.trim();
        const level = document.getElementById(levelId)?.value;
        
        if (!name || !level) {
            window.MoneyCareerApp.showAlert('Please enter both skill name and proficiency level', 'warning');
            return;
        }
        
        const skills = type === 'technical' ? this.userData.technicalSkills : this.userData.softSkills;
        
        // Check for duplicates
        if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            window.MoneyCareerApp.showAlert('This skill is already added', 'warning');
            return;
        }
        
        skills.push({ name, level });
        
        // Clear inputs
        document.getElementById(nameId).value = '';
        document.getElementById(levelId).value = '';
        
        // Re-render skills list
        const listId = type === 'technical' ? 'technicalSkillsList' : 'softSkillsList';
        document.getElementById(listId).innerHTML = this.renderSkillsList(type);
        
        this.saveData();
    }

    removeSkill(type, index) {
        const skills = type === 'technical' ? this.userData.technicalSkills : this.userData.softSkills;
        skills.splice(index, 1);
        
        const listId = type === 'technical' ? 'technicalSkillsList' : 'softSkillsList';
        document.getElementById(listId).innerHTML = this.renderSkillsList(type);
        
        this.saveData();
    }

    toggleRole(role, checked) {
        if (checked) {
            if (!this.userData.targetRoles.includes(role)) {
                this.userData.targetRoles.push(role);
            }
        } else {
            this.userData.targetRoles = this.userData.targetRoles.filter(r => r !== role);
        }
        this.saveData();
    }

    // Generate career plan
    generateCareerPlan() {
        // Save final step data
        this.saveCurrentStepData();
        
        // Show loading
        const container = document.getElementById('moduleContainer');
        container.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <h2>Generating Your Personalized Career Plan...</h2>
                <p>Analyzing your skills, mapping gaps, and creating your roadmap</p>
            </div>
        `;
        
        // Generate all outputs
        setTimeout(() => {
            this.userData.generatedResults = {
                skillMapping: this.generateSkillMapping(),
                learningRoadmap: this.generateLearningRoadmap(),
                resumeBullets: this.generateResumeBullets(),
                coverLetter: this.generateCoverLetter(),
                linkedInProfile: this.generateLinkedInProfile(),
                generatedAt: new Date().toISOString()
            };
            
            this.saveData();
            this.renderCompleteDashboard();
            
            window.MoneyCareerApp.showAlert('Your career plan is ready!', 'success');
        }, 2000);
    }

    generateSkillMapping() {
        const mapping = {
            matchedSkills: [],
            missingSkills: [],
            partiallyMatchedSkills: [],
            matchPercentage: 0
        };
        
        if (this.userData.targetRoles.length === 0) {
            return mapping;
        }
        
        const allUserSkills = [
            ...this.userData.technicalSkills.map(s => ({ name: s.name.toLowerCase(), level: s.level, original: s.name })),
            ...this.userData.softSkills.map(s => ({ name: s.name.toLowerCase(), level: s.level, original: s.name }))
        ];
        
        const allRequiredSkills = new Set();
        const allPreferredSkills = new Set();
        const skillPriorityMap = new Map(); // Track which roles need which skills
        
        // Collect all required and preferred skills from target roles
        this.userData.targetRoles.forEach(role => {
            const requirements = this.roleRequirements[role];
            if (requirements) {
                requirements.technical.forEach(skill => {
                    allRequiredSkills.add(skill);
                    if (!skillPriorityMap.has(skill)) {
                        skillPriorityMap.set(skill, []);
                    }
                    skillPriorityMap.get(skill).push(role);
                });
                requirements.soft.forEach(skill => {
                    allRequiredSkills.add(skill);
                    if (!skillPriorityMap.has(skill)) {
                        skillPriorityMap.set(skill, []);
                    }
                    skillPriorityMap.get(skill).push(role);
                });
            }
        });
        
        // Categorize skills - more intelligent matching
        allRequiredSkills.forEach(requiredSkill => {
            const matchedUserSkill = allUserSkills.find(userSkill => {
                const reqLower = requiredSkill.toLowerCase();
                const userLower = userSkill.name;
                // Match if either contains the other (e.g., "JavaScript" matches "JS", "React" matches "React or Vue")
                return userLower.includes(reqLower) || 
                       reqLower.includes(userLower) ||
                       userLower === reqLower ||
                       this.areSkillsSimilar(reqLower, userLower);
            });
            
            if (matchedUserSkill) {
                // User has this skill
                const proficiencyScore = this.getProficiencyScore(matchedUserSkill.level);
                
                if (proficiencyScore >= 2) {
                    // Intermediate or Advanced - good match
                    mapping.matchedSkills.push({
                        skill: requiredSkill,
                        userLevel: matchedUserSkill.level,
                        userSkillName: matchedUserSkill.original
                    });
                } else {
                    // Beginner - partially matched, needs improvement
                    mapping.partiallyMatchedSkills.push({
                        skill: requiredSkill,
                        userLevel: matchedUserSkill.level,
                        priority: 'Medium',
                        reason: `You have ${requiredSkill} at beginner level - strengthen to intermediate`,
                        rolesRequiring: skillPriorityMap.get(requiredSkill)
                    });
                }
            } else {
                // User doesn't have this skill at all
                const rolesRequiring = skillPriorityMap.get(requiredSkill);
                const isRequiredByAll = rolesRequiring.length === this.userData.targetRoles.length;
                
                mapping.missingSkills.push({
                    skill: requiredSkill,
                    priority: isRequiredByAll ? 'High' : (rolesRequiring.length > 1 ? 'Medium' : 'Low'),
                    reason: `Required for ${rolesRequiring.join(', ')}`,
                    rolesRequiring: rolesRequiring,
                    isCore: this.isCoreSkill(requiredSkill)
                });
            }
        });
        
        // Sort missing skills by priority and importance
        mapping.missingSkills.sort((a, b) => {
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            // If same priority, core skills come first
            if (a.isCore !== b.isCore) {
                return a.isCore ? -1 : 1;
            }
            return 0;
        });
        
        // Calculate match percentage
        const totalRequired = allRequiredSkills.size;
        const fullyMatched = mapping.matchedSkills.length;
        const partiallyMatched = mapping.partiallyMatchedSkills.length * 0.5; // Count as half
        
        mapping.matchPercentage = totalRequired > 0 
            ? Math.round(((fullyMatched + partiallyMatched) / totalRequired) * 100) 
            : 0;
        
        return mapping;
    }

    areSkillsSimilar(skill1, skill2) {
        // Define skill synonyms and related terms
        const synonyms = {
            'js': ['javascript'],
            'javascript': ['js'],
            'react': ['reactjs', 'react.js'],
            'node.js': ['nodejs', 'node'],
            'html/css': ['html', 'css'],
            'sql': ['mysql', 'postgresql', 'database'],
            'python': ['py'],
            'communication': ['verbal communication', 'written communication'],
            'problem solving': ['analytical thinking', 'critical thinking']
        };
        
        for (let [key, values] of Object.entries(synonyms)) {
            if ((skill1.includes(key) || key.includes(skill1)) && 
                values.some(v => skill2.includes(v) || v.includes(skill2))) {
                return true;
            }
        }
        return false;
    }

    getProficiencyScore(level) {
        const scores = {
            'Beginner': 1,
            'Intermediate': 2,
            'Advanced': 3
        };
        return scores[level] || 0;
    }

    isCoreSkill(skill) {
        // Define core/fundamental skills that are essential
        const coreSkills = [
            'JavaScript', 'Python', 'HTML/CSS', 'Git', 'SQL',
            'Communication', 'Problem Solving', 'Teamwork'
        ];
        return coreSkills.some(core => 
            skill.toLowerCase().includes(core.toLowerCase()) || 
            core.toLowerCase().includes(skill.toLowerCase())
        );
    }

    generateLearningRoadmap() {
        const roadmap = {
            phase1: [],  // 0-3 months - Foundation
            phase2: [],  // 3-6 months - Enhancement
            phase3: []   // 6-12 months - Mastery
        };
        
        const skillMapping = this.userData.generatedResults?.skillMapping || this.generateSkillMapping();
        
        // Categorize missing skills by priority
        const highPrioritySkills = skillMapping.missingSkills.filter(s => s.priority === 'High');
        const mediumPrioritySkills = skillMapping.missingSkills.filter(s => s.priority === 'Medium');
        const lowPrioritySkills = skillMapping.missingSkills.filter(s => s.priority === 'Low');
        
        // Phase 1 (0-3 months): Core foundational skills - HIGH PRIORITY
        highPrioritySkills.slice(0, 3).forEach(gap => {
            roadmap.phase1.push({
                skill: gap.skill,
                activity: this.getRecommendedActivity(gap.skill, 'beginner'),
                effort: this.getEffortLevel(gap.skill),
                resources: this.getResourceRecommendation(gap.skill),
                priority: 'High',
                reason: 'Critical for target role - focus on fundamentals first'
            });
        });
        
        // Phase 2 (3-6 months): Build on foundation - MEDIUM PRIORITY
        const phase2Skills = [
            ...highPrioritySkills.slice(3, 5),
            ...mediumPrioritySkills.slice(0, 2)
        ];
        phase2Skills.forEach(gap => {
            roadmap.phase2.push({
                skill: gap.skill,
                activity: this.getRecommendedActivity(gap.skill, 'intermediate'),
                effort: this.getEffortLevel(gap.skill),
                resources: this.getResourceRecommendation(gap.skill),
                priority: gap.priority,
                reason: 'Strengthen expertise and competitive advantage'
            });
        });
        
        // Phase 3 (6-12 months): Advanced skills - LOW/MEDIUM PRIORITY
        const phase3Skills = [
            ...mediumPrioritySkills.slice(2, 4),
            ...lowPrioritySkills.slice(0, 2)
        ];
        phase3Skills.forEach(gap => {
            roadmap.phase3.push({
                skill: gap.skill,
                activity: this.getRecommendedActivity(gap.skill, 'advanced'),
                effort: this.getEffortLevel(gap.skill),
                resources: this.getResourceRecommendation(gap.skill),
                priority: gap.priority,
                reason: 'Advanced skills to stand out'
            });
        });
        
        // If user has few gaps, add skills they want to strengthen
        if (roadmap.phase1.length < 2) {
            this.userData.technicalSkills
                .filter(s => s.level === 'Beginner')
                .slice(0, 2)
                .forEach(skill => {
                    roadmap.phase1.push({
                        skill: skill.name,
                        activity: `Strengthen ${skill.name} from beginner to intermediate level through practice`,
                        effort: 'Medium',
                        resources: this.getResourceRecommendation(skill.name),
                        priority: 'Medium',
                        reason: 'Improve existing skill proficiency'
                    });
                });
        }
        
        return roadmap;
    }

    getRecommendedActivity(skill, level = 'beginner') {
        const activities = {
            'JavaScript': {
                beginner: 'Start with JavaScript basics course (variables, functions, loops) + build a simple calculator or to-do list app',
                intermediate: 'Learn ES6+ features, DOM manipulation, and async programming + build 2-3 interactive web projects',
                advanced: 'Master advanced patterns (closures, prototypes), build full-stack projects, contribute to open source'
            },
            'Python': {
                beginner: 'Complete Python fundamentals course + solve 20-30 beginner coding challenges on HackerRank',
                intermediate: 'Learn OOP, file handling, APIs + build a data analysis or automation project',
                advanced: 'Explore frameworks (Django/Flask), data structures & algorithms, work on real-world projects'
            },
            'React': {
                beginner: 'Learn React basics (components, props, state) + build 1-2 small apps (weather app, blog)',
                intermediate: 'Master hooks, context API, routing + build a portfolio website or e-commerce frontend',
                advanced: 'Learn performance optimization, testing, state management (Redux/Zustand) + complex projects'
            },
            'SQL': {
                beginner: 'Learn basic queries (SELECT, WHERE, JOIN) + practice on SQLBolt or Khan Academy',
                intermediate: 'Study aggregations, subqueries, indexes + solve intermediate SQL challenges on LeetCode',
                advanced: 'Master query optimization, stored procedures, database design + work with real datasets'
            },
            'Git': {
                beginner: 'Learn basic commands (clone, add, commit, push) + create your first GitHub repository',
                intermediate: 'Practice branching, merging, pull requests + contribute to 1-2 open-source projects',
                advanced: 'Master rebasing, cherry-picking, resolving conflicts + lead team Git workflows'
            },
            'Communication': {
                beginner: 'Join Toastmasters or practice presenting to friends + watch TED talks and analyze delivery',
                intermediate: 'Present weekly at team meetings or study groups + practice writing clear emails',
                advanced: 'Lead workshops or training sessions + mentor others in communication skills'
            },
            'Leadership': {
                beginner: 'Volunteer to coordinate small group projects + read leadership books (Start with Why)',
                intermediate: 'Lead a project team or student organization + practice delegation and motivation',
                advanced: 'Mentor junior members, make strategic decisions, handle conflicts professionally'
            },
            'Problem Solving': {
                beginner: 'Solve 2-3 easy coding challenges per week on LeetCode or HackerRank',
                intermediate: 'Solve medium-level problems + participate in coding competitions or hackathons',
                advanced: 'Tackle hard problems, optimize solutions, teach problem-solving approaches to others'
            },
            'HTML/CSS': {
                beginner: 'Learn HTML structure and CSS basics + build 2-3 simple static web pages',
                intermediate: 'Master Flexbox, Grid, responsive design + recreate professional website layouts',
                advanced: 'Learn CSS preprocessors (SASS), animations, accessibility best practices'
            },
            'Data Visualization': {
                beginner: 'Learn Excel charts or basic Tableau + create 3-5 simple visualizations',
                intermediate: 'Master Tableau/Power BI or Python libraries (Matplotlib, Seaborn) + build dashboards',
                advanced: 'Create interactive dashboards, tell stories with data, optimize for stakeholder communication'
            }
        };
        
        if (activities[skill]) {
            return activities[skill][level] || activities[skill].beginner;
        }
        
        // Generic fallback
        return {
            beginner: `Start with online tutorials and basics of ${skill} + practice with 2-3 beginner projects`,
            intermediate: `Take an intermediate course on ${skill} + build 2-3 practical projects`,
            advanced: `Master advanced concepts of ${skill} + contribute to real-world projects or open source`
        }[level];
    }

    getEffortLevel(skill) {
        const highEffort = [
            'JavaScript', 'Python', 'Java', 'System Design', 'Machine Learning', 
            'AWS', 'Docker', 'Kubernetes', 'Data Science', 'React', 'Angular'
        ];
        const mediumEffort = [
            'SQL', 'Git', 'HTML/CSS', 'Communication', 'Leadership', 
            'Data Analysis', 'Excel', 'Figma', 'UI Design'
        ];
        
        if (highEffort.some(s => skill.includes(s) || s.includes(skill))) return 'High';
        if (mediumEffort.some(s => skill.includes(s) || s.includes(skill))) return 'Medium';
        return 'Low';
    }

    getResourceRecommendation(skill) {
        const resources = {
            'JavaScript': 'freeCodeCamp (free), JavaScript.info (free), Codecademy JavaScript course, Udemy "The Complete JavaScript Course"',
            'Python': 'Python.org tutorials (free), Coursera Python for Everybody (free), Real Python, Automate the Boring Stuff (free book)',
            'React': 'React official docs (free), Scrimba React course (free), freeCodeCamp React, Frontend Masters',
            'SQL': 'SQLBolt (free), Mode Analytics SQL Tutorial (free), Khan Academy SQL, LeetCode Database problems',
            'Git': 'Git official documentation (free), GitHub Skills (free), Atlassian Git tutorials (free)',
            'Machine Learning': 'Coursera ML by Andrew Ng (free to audit), Fast.ai (free), Kaggle Learn (free), Google ML Crash Course (free)',
            'AWS': 'AWS Free Tier + official tutorials, A Cloud Guru, Udemy AWS courses, AWS Certified Cloud Practitioner path',
            'HTML/CSS': 'freeCodeCamp (free), MDN Web Docs (free), CSS-Tricks, Scrimba HTML/CSS course (free)',
            'Communication': 'Toastmasters International, LinkedIn Learning soft skills courses, YouTube: TED masterclass',
            'Leadership': 'Books: Leaders Eat Last, Start with Why; Volunteer leadership roles; LinkedIn Learning leadership courses',
            'Problem Solving': 'LeetCode (free tier), HackerRank (free), Codewars (free), Project Euler (free)',
            'Data Visualization': 'Tableau Public (free), Power BI Desktop (free), Coursera Data Visualization courses',
            'Excel': 'Excel Easy (free tutorials), Coursera Excel courses, YouTube Excel channels (Leila Gharani)',
            'Figma': 'Figma official tutorials (free), YouTube Figma courses, Figma Community resources (free)',
            'Node.js': 'Node.js official docs (free), freeCodeCamp Node.js, The Odin Project (free)',
            'Docker': 'Docker official tutorials (free), Play with Docker (free), YouTube Docker tutorials',
            'Product Strategy': 'Reforge Product Strategy (paid), Product School resources, books: Inspired, The Lean Startup',
            'Agile/Scrum': 'Scrum.org Learning Path (free), Coursera Agile courses, YouTube Agile tutorials',
            'REST APIs': 'MDN HTTP docs (free), Postman Learning Center (free), freeCodeCamp API tutorials'
        };
        
        return resources[skill] || 'YouTube tutorials (free), Udemy courses, Coursera (audit for free), LinkedIn Learning';
    }

    generateResumeBullets() {
        const bullets = [];
        
        // Based on target roles and current skills
        this.userData.targetRoles.forEach(role => {
            const relevantSkills = this.userData.technicalSkills
                .filter(s => s.level === 'Intermediate' || s.level === 'Advanced')
                .slice(0, 5);
            
            relevantSkills.forEach(skill => {
                bullets.push(this.createResumeBullet(skill.name, role));
            });
        });
        
        return bullets.slice(0, 8); // Limit to 8 bullets
    }

    createResumeBullet(skill, role) {
        const templates = {
            'JavaScript': `Developed responsive web applications using ${skill} and modern frameworks, improving user experience and code maintainability`,
            'Python': `Utilized ${skill} to automate data processing tasks, reducing manual work by 40% and improving accuracy`,
            'SQL': `Designed and optimized ${skill} queries to extract insights from large datasets, supporting data-driven decision making`,
            'React': `Built interactive user interfaces with ${skill}, implementing component-based architecture for reusability`,
            'Communication': `Demonstrated strong ${skill.toLowerCase()} skills by presenting technical concepts to non-technical stakeholders`,
            'Leadership': `Exhibited ${skill.toLowerCase()} by mentoring junior team members and facilitating team collaboration`
        };
        
        return templates[skill] || `Applied ${skill} expertise to deliver high-quality solutions in ${role.toLowerCase()} responsibilities`;
    }

    generateCoverLetter() {
        const targetRole = this.userData.targetRoles[0] || 'the position';
        const topSkills = this.userData.technicalSkills.slice(0, 3).map(s => s.name).join(', ');
        
        return `Dear Hiring Manager,

I am writing to express my strong interest in the ${targetRole} position. As a ${this.userData.educationLevel.toLowerCase()} with ${this.userData.yearsExperience} year(s) of experience in ${this.userData.currentRole}, I am excited about the opportunity to contribute to your team.

My background in ${topSkills} has prepared me well for this role. ${this.userData.shortTermGoals} Over the past ${this.userData.yearsExperience > 0 ? 'few years' : 'months'}, I have developed strong skills in both technical execution and collaborative problem-solving.

${this.userData.certifications.length > 0 ? `I have also completed certifications including ${this.userData.certifications.slice(0, 2).join(' and ')}, demonstrating my commitment to continuous learning.` : 'I am committed to continuous learning and staying updated with industry best practices.'}

I am particularly drawn to ${this.userData.preferredIndustry ? `opportunities in the ${this.userData.preferredIndustry} industry` : 'this opportunity'} where I can apply my skills and continue to grow professionally. ${this.userData.longTermGoals ? `My long-term goal is to ${this.userData.longTermGoals.toLowerCase()}, and I believe this role aligns perfectly with that vision.` : ''}

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experiences align with your team's needs.

Sincerely,
[Your Name]`;
    }

    generateLinkedInProfile() {
        const topRole = this.userData.targetRoles[0] || 'Professional';
        const topSkills = [
            ...this.userData.technicalSkills.slice(0, 5),
            ...this.userData.softSkills.slice(0, 3)
        ];
        
        return {
            headline: `${this.userData.educationLevel} | Aspiring ${topRole} | ${topSkills.slice(0, 3).map(s => s.name).join(' • ')}`,
            
            about: `🎯 About Me
I'm a motivated ${this.userData.educationLevel.toLowerCase()} currently working as ${this.userData.currentRole}, with a passion for ${this.userData.preferredIndustry || 'technology and innovation'}.

💼 My Journey
${this.userData.yearsExperience > 0 ? `With ${this.userData.yearsExperience} years of hands-on experience, I've developed expertise in ${topSkills.slice(0, 3).map(s => s.name).join(', ')}.` : `I'm building my expertise in ${topSkills.slice(0, 3).map(s => s.name).join(', ')} through coursework and personal projects.`}

🚀 What Drives Me
${this.userData.shortTermGoals} ${this.userData.longTermGoals ? `Looking ahead, I aim to ${this.userData.longTermGoals.toLowerCase()}.` : ''}

${this.userData.certifications.length > 0 ? `📜 Certifications
${this.userData.certifications.map(c => `• ${c}`).join('\n')}` : ''}

💡 I'm always eager to connect with like-minded professionals and explore opportunities in ${this.userData.preferredIndustry || 'various industries'}. Let's connect!`,
            
            skills: topSkills.map(s => s.name),
            
            keywords: this.generateKeywords()
        };
    }

    generateKeywords() {
        const keywords = new Set();
        
        this.userData.targetRoles.forEach(role => {
            keywords.add(role);
            const requirements = this.roleRequirements[role];
            if (requirements) {
                requirements.technical.forEach(skill => keywords.add(skill));
                requirements.soft.slice(0, 3).forEach(skill => keywords.add(skill));
            }
        });
        
        return Array.from(keywords).slice(0, 20);
    }

    renderCompleteDashboard() {
        const container = document.getElementById('moduleContainer');
        const results = this.userData.generatedResults;
        
        if (!results) {
            this.renderWizard();
            return;
        }
        
        container.innerHTML = `
            <div class="career-dashboard">
                <div class="dashboard-header">
                    <h1><i class="fas fa-rocket"></i> Your Personalized Career Plan</h1>
                    <p>Generated on ${new Date(results.generatedAt).toLocaleDateString()}</p>
                    <div class="dashboard-actions">
                        <button onclick="careerModule.startOver()" class="btn btn-secondary">
                            <i class="fas fa-redo"></i> Start Over
                        </button>
                        <button onclick="careerModule.exportPlan()" class="btn btn-primary">
                            <i class="fas fa-download"></i> Export Plan
                        </button>
                    </div>
                </div>
                
                ${this.renderSkillMappingSection(results.skillMapping)}
                ${this.renderLearningRoadmapSection(results.learningRoadmap)}
                ${this.renderApplicationMaterialsSection(results.resumeBullets, results.coverLetter)}
                ${this.renderLinkedInSection(results.linkedInProfile)}
                
                <div class="dashboard-footer">
                    <button onclick="window.MoneyCareerApp.openChatbot()" class="btn btn-accent btn-large">
                        <i class="fas fa-comments"></i> Get AI Guidance
                    </button>
                </div>
            </div>
        `;
    }

    renderSkillMappingSection(mapping) {
        return `
            <div class="dashboard-section">
                <h2><i class="fas fa-chart-line"></i> Skill Match Analysis</h2>
                <div class="match-overview">
                    <div class="match-score">
                        <div class="score-circle ${mapping.matchPercentage >= 70 ? 'high' : mapping.matchPercentage >= 40 ? 'medium' : 'low'}">
                            <span class="score-number">${mapping.matchPercentage}%</span>
                            <span class="score-label">Match</span>
                        </div>
                    </div>
                    <div class="match-details">
                        <p>${mapping.matchedSkills.length} skills matched • ${mapping.missingSkills.length} skills to develop</p>
                    </div>
                </div>
                
                <div class="skills-breakdown">
                    <div class="matched-skills">
                        <h3><i class="fas fa-check-circle" style="color: #43A047;"></i> Skills You Have</h3>
                        <div class="skill-list">
                            ${mapping.matchedSkills.length > 0 ? mapping.matchedSkills.map(s => `
                                <div class="skill-item matched">
                                    <span class="skill-name">${s.skill}</span>
                                    <span class="skill-level">${s.userLevel}</span>
                                </div>
                            `).join('') : '<p>No matched skills found</p>'}
                        </div>
                    </div>
                    
                    <div class="missing-skills">
                        <h3><i class="fas fa-arrow-up" style="color: #FFA726;"></i> Skills to Develop</h3>
                        <div class="skill-list">
                            ${mapping.missingSkills.length > 0 ? mapping.missingSkills.map(s => `
                                <div class="skill-item missing">
                                    <div>
                                        <span class="skill-name">${s.skill}</span>
                                        <span class="priority-badge ${s.priority.toLowerCase()}">${s.priority}</span>
                                    </div>
                                    <small>${s.reason}</small>
                                </div>
                            `).join('') : '<p>Great! You have all required skills</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLearningRoadmapSection(roadmap) {
        return `
            <div class="dashboard-section">
                <h2><i class="fas fa-map-marked-alt"></i> Your Learning Roadmap</h2>
                <p class="section-description">A practical, step-by-step plan to close your skill gaps</p>
                
                <div class="roadmap-phases">
                    <div class="roadmap-phase">
                        <h3><i class="fas fa-seedling"></i> Phase 1: Foundation (0-3 months)</h3>
                        <p>Build core skills needed for your target role</p>
                        ${this.renderPhaseItems(roadmap.phase1)}
                    </div>
                    
                    <div class="roadmap-phase">
                        <h3><i class="fas fa-chart-line"></i> Phase 2: Enhancement (3-6 months)</h3>
                        <p>Strengthen your expertise and add complementary skills</p>
                        ${this.renderPhaseItems(roadmap.phase2)}
                    </div>
                    
                    <div class="roadmap-phase">
                        <h3><i class="fas fa-trophy"></i> Phase 3: Mastery (6-12 months)</h3>
                        <p>Advanced skills to stand out from other candidates</p>
                        ${this.renderPhaseItems(roadmap.phase3)}
                    </div>
                </div>
            </div>
        `;
    }

    renderPhaseItems(items) {
        if (items.length === 0) {
            return '<p class="empty-phase">✅ No gaps identified for this phase - you\'re on track!</p>';
        }
        
        return `
            <div class="phase-items">
                ${items.map((item, index) => `
                    <div class="roadmap-item">
                        <div class="item-header">
                            <h4>${index + 1}. ${item.skill}</h4>
                            <span class="effort-badge ${item.effort.toLowerCase()}">${item.effort} Effort</span>
                        </div>
                        ${item.reason ? `<p class="item-reason"><em>${item.reason}</em></p>` : ''}
                        <p class="item-activity"><strong>📚 What to do:</strong> ${item.activity}</p>
                        <p class="item-resources"><strong>🔗 Resources:</strong> ${item.resources}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderApplicationMaterialsSection(resumeBullets, coverLetter) {
        return `
            <div class="dashboard-section">
                <h2><i class="fas fa-file-alt"></i> Application Materials</h2>
                <p class="section-description">Ready-to-use content for your job applications</p>
                
                <div class="application-materials">
                    <div class="material-card">
                        <h3><i class="fas fa-list-ul"></i> Resume Bullet Points</h3>
                        <p>Use these to highlight your relevant experience and skills</p>
                        <div class="content-box" id="resumeBullets">
                            ${resumeBullets.map((bullet, i) => `
                                <div class="bullet-item">
                                    <span class="bullet-number">${i + 1}</span>
                                    <p>${bullet}</p>
                                </div>
                            `).join('')}
                        </div>
                        <button onclick="careerModule.copyContent('resumeBullets')" class="btn btn-secondary btn-sm">
                            <i class="fas fa-copy"></i> Copy All
                        </button>
                    </div>
                    
                    <div class="material-card">
                        <h3><i class="fas fa-envelope"></i> Cover Letter Draft</h3>
                        <p>Customize this template for specific applications</p>
                        <div class="content-box editable" id="coverLetter" contenteditable="true">
                            ${coverLetter.replace(/\n/g, '<br>')}
                        </div>
                        <div class="material-actions">
                            <button onclick="careerModule.copyContent('coverLetter')" class="btn btn-secondary btn-sm">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            <button onclick="careerModule.saveCoverLetter()" class="btn btn-primary btn-sm">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLinkedInSection(profile) {
        return `
            <div class="dashboard-section">
                <h2><i class="fab fa-linkedin"></i> LinkedIn Profile Optimization</h2>
                <p class="section-description">Stand out to recruiters with an optimized profile</p>
                
                <div class="linkedin-profile">
                    <div class="profile-field">
                        <h3><i class="fas fa-heading"></i> Headline</h3>
                        <p>This appears right under your name - make it count!</p>
                        <div class="content-box editable" id="linkedinHeadline" contenteditable="true">
                            ${profile.headline}
                        </div>
                        <button onclick="careerModule.copyContent('linkedinHeadline')" class="btn btn-secondary btn-sm">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    
                    <div class="profile-field">
                        <h3><i class="fas fa-user"></i> About Section</h3>
                        <p>Tell your story and showcase your value</p>
                        <div class="content-box editable" id="linkedinAbout" contenteditable="true">
                            ${profile.about.replace(/\n/g, '<br>')}
                        </div>
                        <button onclick="careerModule.copyContent('linkedinAbout')" class="btn btn-secondary btn-sm">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    
                    <div class="profile-field">
                        <h3><i class="fas fa-tags"></i> Skills to Add (${profile.skills.length})</h3>
                        <p>Add these to your LinkedIn skills section</p>
                        <div class="skills-tags">
                            ${profile.skills.map(skill => `<span class="skill-tag-display">${skill}</span>`).join('')}
                        </div>
                        <button onclick="careerModule.copyContent('linkedinSkills')" class="btn btn-secondary btn-sm">
                            <i class="fas fa-copy"></i> Copy Skills List
                        </button>
                    </div>
                    
                    <div class="profile-field">
                        <h3><i class="fas fa-search"></i> Keywords for ATS & Recruiters</h3>
                        <p>Use these throughout your profile to improve visibility</p>
                        <div class="keywords-box">
                            ${profile.keywords.map(kw => `<span class="keyword-badge">${kw}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Utility methods
    copyContent(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let text = '';
        if (elementId === 'linkedinSkills') {
            const profile = this.userData.generatedResults.linkedInProfile;
            text = profile.skills.join(', ');
        } else {
            text = element.innerText || element.textContent;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            window.MoneyCareerApp.showAlert('Copied to clipboard!', 'success');
        }).catch(() => {
            window.MoneyCareerApp.showAlert('Failed to copy', 'error');
        });
    }

    saveCoverLetter() {
        const element = document.getElementById('coverLetter');
        if (element && this.userData.generatedResults) {
            this.userData.generatedResults.coverLetter = element.innerText;
            this.saveData();
            window.MoneyCareerApp.showAlert('Cover letter saved', 'success');
        }
    }

    exportPlan() {
        const dataStr = JSON.stringify(this.userData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `career-plan-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        window.MoneyCareerApp.showAlert('Career plan exported successfully', 'success');
    }

    startOver() {
        if (confirm('Are you sure? This will reset all your data and start fresh.')) {
            this.currentStep = 1;
            this.userData = {
                educationLevel: '',
                currentRole: '',
                yearsExperience: 0,
                certifications: [],
                technicalSkills: [],
                softSkills: [],
                targetRoles: [],
                preferredIndustry: '',
                preferredLocation: '',
                shortTermGoals: '',
                longTermGoals: '',
                generatedResults: null
            };
            this.saveData();
            this.renderWizard();
            window.MoneyCareerApp.showAlert('Starting fresh!', 'info');
        }
    }
}

// Initialize module
let careerModule = null;
if (typeof window !== 'undefined') {
    careerModule = new CareerModule();
}
