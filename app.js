const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Money & Career',
        activeModule: 'home'
    });
});

app.get('/finance', (req, res) => {
    res.render('index', { 
        title: 'Finance Tracking',
        activeModule: 'finance'
    });
});

app.get('/investing', (req, res) => {
    res.render('index', { 
        title: 'Investing Coach',
        activeModule: 'investing'
    });
});

app.get('/career', (req, res) => {
    res.render('index', { 
        title: 'Career Mapping',
        activeModule: 'career'
    });
});

app.get('/interview', (req, res) => {
    res.render('index', { 
        title: 'Interview Prep',
        activeModule: 'interview'
    });
});

app.get('/tasks', (req, res) => {
    res.render('index', { 
        title: 'Task Prioritization',
        activeModule: 'tasks'
    });
});

app.get('/meetings', (req, res) => {
    res.render('index', { 
        title: 'Meeting Follow-ups',
        activeModule: 'meetings'
    });
});

// API Routes for AI Agent Modules
app.post('/api/finance/process', (req, res) => {
    // Finance tracking logic would go here
    res.json({ status: 'success', message: 'Finance data processed' });
});

app.post('/api/investing/analyze', (req, res) => {
    // Investing coaching logic would go here
    res.json({ status: 'success', message: 'Investment analysis complete' });
});

app.post('/api/career/map', (req, res) => {
    // Career mapping logic would go here
    res.json({ status: 'success', message: 'Career path generated' });
});

app.post('/api/interview/prepare', (req, res) => {
    // Interview preparation logic would go here
    res.json({ status: 'success', message: 'Interview prep materials ready' });
});

app.post('/api/tasks/prioritize', (req, res) => {
    // Task prioritization logic would go here
    res.json({ status: 'success', message: 'Tasks prioritized' });
});

app.post('/api/meetings/summarize', (req, res) => {
    // Meeting follow-up logic would go here
    res.json({ status: 'success', message: 'Meeting summary created' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Money & Career server running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
});
