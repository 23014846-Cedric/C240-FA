// ========================================
// Money & Career - Main JavaScript
// ========================================

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeMobileMenu();
    initializeModuleContent();
});

// === Application Initialization ===
function initializeApp() {
    console.log('Money & Career Application Initialized');
    
    // Check if user is on a module page
    const activeModule = document.body.dataset.module || getActiveModuleFromURL();
    if (activeModule && activeModule !== 'home') {
        loadModuleContent(activeModule);
    }
}

// === Mobile Menu ===
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            const isOpen = menu.classList.contains('active');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    }
}

// === Module Content Loading ===
function initializeModuleContent() {
    const moduleContainer = document.getElementById('moduleContainer');
    if (!moduleContainer) return;
    
    // Add loading state
    showLoading(moduleContainer);
    
    // Simulate content loading (in real app, this would fetch from API)
    setTimeout(() => {
        hideLoading(moduleContainer);
    }, 500);
}

function getActiveModuleFromURL() {
    const path = window.location.pathname;
    const module = path.split('/')[1];
    return module || 'home';
}

// === Loading States ===
function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading content...</p>
        </div>
    `;
}

function hideLoading(container) {
    const loading = container.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// === Utility Functions ===
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function formatPercentage(value) {
    return `${(value * 100).toFixed(1)}%`;
}

// === API Helper Functions ===
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showAlert('error', 'An error occurred. Please try again.');
        throw error;
    }
}

// === Alert System ===
function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Insert at top of main content area
    const mainContent = document.querySelector('.module-content') || document.querySelector('.hero');
    if (mainContent) {
        mainContent.insertBefore(alert, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// === Form Validation ===
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            showFieldError(input, 'This field is required');
        } else {
            input.classList.remove('error');
            hideFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('field-error')) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    errorElement.textContent = message;
}

function hideFieldError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.remove();
    }
}

// === Local Storage Helpers ===
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// === Chatbot Integration ===
function openChatbot() {
    // The Botpress chatbot is loaded via script tags
    // This function can be enhanced to pass context to the chatbot
    if (window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: 'show' });
        
        // Send current module context to chatbot
        const activeModule = getActiveModuleFromURL();
        if (activeModule !== 'home') {
            window.botpressWebChat.sendEvent({
                type: 'proactive-trigger',
                payload: { text: `I'm on the ${activeModule} page` }
            });
        }
    } else {
        console.warn('Botpress webchat not loaded yet');
    }
}

// === Animation Helpers ===
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        element.style.opacity = Math.min(progress / duration, 1);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        element.style.opacity = Math.max(1 - (progress / duration), 0);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// === Debounce Function ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === Export for module use ===
window.MoneyCareerApp = {
    showAlert,
    validateForm,
    formatCurrency,
    formatDate,
    formatPercentage,
    fetchAPI,
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
    showLoading,
    hideLoading,
    fadeIn,
    fadeOut,
    debounce,
    openChatbot
};
