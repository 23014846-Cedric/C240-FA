const express = require('express');
const path = require('path');
const multer = require('multer');
const XLSX = require('xlsx');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow Excel files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

// In-memory storage for tasks (in production, use a database)
let tasks = [];

// Helper function to parse Excel file
function parseExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  return data.map(row => ({
    task: row.Task || row.task || '',
    priority: row.Priority || row.priority || 'Medium',
    deadline: row.Deadline || row.deadline || new Date().toISOString().split('T')[0]
  }));
}

// Helper function to calculate days until deadline
function calculateDaysUntil(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue by ' + Math.abs(diffDays) + ' days';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return diffDays + ' days';
}

// Helper function to sort tasks
function sortTasks(taskList) {
  return taskList.sort((a, b) => {
    // First sort by deadline (closest first)
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);
    
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    
    // Then sort by priority
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    const priorityA = priorityOrder[a.priority] || 1;
    const priorityB = priorityOrder[b.priority] || 1;
    
    return priorityA - priorityB;
  });
}

// Routes
app.get('/', (req, res) => {
  const sortedTasks = sortTasks([...tasks]);
  // Add daysUntil to each task for template rendering
  const tasksWithDays = sortedTasks.map(task => ({
    ...task,
    daysUntil: calculateDaysUntil(task.deadline)
  }));
  res.render('index', { tasks: tasksWithDays, message: null });
});

app.post('/upload', upload.single('excelFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.render('index', { tasks: [], message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    tasks = parseExcelFile(filePath);
    const sortedTasks = sortTasks([...tasks]);
    
    // Add daysUntil to each task for template rendering
    const tasksWithDays = sortedTasks.map(task => ({
      ...task,
      daysUntil: calculateDaysUntil(task.deadline)
    }));

    res.render('index', { 
      tasks: tasksWithDays, 
      message: `Successfully uploaded ${tasks.length} tasks!` 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.render('index', { 
      tasks: [], 
      message: 'Error uploading file: ' + error.message 
    });
  }
});

app.post('/delete-task', (req, res) => {
  try {
    const { taskName, deadline } = req.body;
    
    // Find and remove the task with matching name and deadline
    const taskIndex = tasks.findIndex(t => t.task === taskName && t.deadline === deadline);
    
    if (taskIndex === -1) {
      return res.json({ error: 'Task not found' });
    }
    
    // Remove task from array
    tasks.splice(taskIndex, 1);
    
    // Sort remaining tasks
    const sortedTasks = sortTasks([...tasks]);
    const tasksWithDays = sortedTasks.map(task => ({
      ...task,
      daysUntil: calculateDaysUntil(task.deadline)
    }));
    
    res.json({ success: true, tasks: tasksWithDays });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.json({ error: 'Error deleting task: ' + error.message });
  }
});

app.post('/add-task', (req, res) => {
  try {
    const { task, priority, deadline } = req.body;
    
    if (!task || !priority || !deadline) {
      return res.json({ error: 'All fields are required' });
    }
    
    // Add new task
    tasks.push({
      task: task.trim(),
      priority: priority,
      deadline: deadline
    });
    
    // Sort all tasks
    const sortedTasks = sortTasks([...tasks]);
    const tasksWithDays = sortedTasks.map(t => ({
      ...t,
      daysUntil: calculateDaysUntil(t.deadline)
    }));
    
    res.json({ success: true, tasks: tasksWithDays, message: 'Task added successfully!' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.json({ error: 'Error adding task: ' + error.message });
  }
});

app.get('/download', (req, res) => {
  try {
    if (tasks.length === 0) {
      return res.json({ error: 'No tasks to download' });
    }
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    
    // Generate file path
    const fileName = `tasks_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, 'uploads', fileName);
    
    // Write file
    XLSX.writeFile(workbook, filePath);
    
    // Send file
    res.download(filePath, 'tasks.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      // Clean up the file after download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.json({ error: 'Error generating file: ' + error.message });
  }
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const n8nWebhookUrl = 'https://n8ngc.codeblazar.org/webhook/chat';

    console.log('➡️ Sending to n8n:', message);

    const response = await axios.post(
      n8nWebhookUrl,
      { chatInput: message },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );

    console.log('⬅️ Raw n8n response:', response.data);

    // ✅ Use the correct property from Respond node
    const reply = response.data?.response || 'No response from chatbot';

    res.json({ reply });

  } catch (error) {
    console.error('❌ n8n chatbot error:', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }

    res.status(500).json({
      error: 'Error communicating with chatbot'
    });
  }
});

// n8n Task Assistant Chatbot - GET request
app.get('/n8n-chatbot', async (req, res) => {
  try {
    const { message, userMessage, chatInput, query } = req.query;
    const userQuery = message || userMessage || chatInput || query;

    if (!userQuery) {
      return res.status(400).json({ 
        error: 'No message provided. Use ?message=your_query or ?userMessage=your_query' 
      });
    }

    const n8nWebhookUrl = 'https://n8ngc.codeblazar.org/webhook/cf707f2e-5a12-45ae-9a06-803c524f87c9/chat';

    console.log('➡️ Sending to n8n Task Assistant:', userQuery);

    // Try with multiple parameter formats
    const response = await axios.get(n8nWebhookUrl, {
      params: { 
        userMessage: userQuery,
        message: userQuery,
        chatInput: userQuery
      },
      timeout: 60000
    });

    console.log('⬅️ Raw n8n Task Assistant response:', response.data);

    // Check if workflow was just started (async mode)
    if (response.data?.message === 'Workflow was started') {
      return res.json({ 
        success: true,
        reply: 'Task assistant workflow has been started. Please note: the n8n webhook is configured for async execution and won\'t return the response immediately. Configure the webhook as "Respond Immediately" in n8n for synchronous responses.',
        userMessage: userQuery,
        workflowStarted: true,
        fullResponse: response.data 
      });
    }

    // Extract response from the JSON structure
    const botResponse = response.data?.response || response.data?.output || response.data?.message || 'No response from task assistant';
    const success = response.data?.success !== false;
    const returnedUserMessage = response.data?.userMessage || userQuery;

    res.json({ 
      success,
      reply: botResponse,
      userMessage: returnedUserMessage,
      fullResponse: response.data 
    });

  } catch (error) {
    console.error('❌ n8n Task Assistant error:', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }

    // Provide specific error messages for common n8n issues
    let userFriendlyMessage = 'Error communicating with n8n task assistant';
    
    if (error.response?.data?.message?.includes('Unused Respond to Webhook')) {
      userFriendlyMessage = 'n8n workflow configuration error: The "Respond to Webhook" node is not properly connected. Please check your n8n workflow and ensure the Respond to Webhook node is connected to the workflow execution path.';
    } else if (error.response?.data?.message === 'Workflow was started') {
      userFriendlyMessage = 'Workflow started but configured for async execution. Please set webhook to "Respond Immediately" in n8n.';
    }

    res.status(500).json({
      success: false,
      error: userFriendlyMessage,
      details: error.message,
      status: error.response?.status,
      n8nMessage: error.response?.data?.message
    });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
