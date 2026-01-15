const express = require("express");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   EJS + MIDDLEWARE
========================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auto set "page" for navbar active state (no need to pass {page:"..."} each time)
app.use((req, res, next) => {
  res.locals.page = req.path.replace("/", "") || "home";
  next();
});

/* =========================
   MULTER UPLOAD SETUP
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow Excel files
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed"));
    }
  },
});

/* =========================
   TASKS LOGIC
========================= */
// In-memory storage for tasks (in production, use a database)
let tasks = [];

function parseExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data.map((row) => ({
    task: row.Task || row.task || "",
    priority: row.Priority || row.priority || "Medium",
    deadline:
      row.Deadline ||
      row.deadline ||
      new Date().toISOString().split("T")[0],
  }));
}

function calculateDaysUntil(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue by " + Math.abs(diffDays) + " days";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return diffDays + " days";
}

function sortTasks(taskList) {
  return taskList.sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }

    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    const priorityA = priorityOrder[a.priority] ?? 1;
    const priorityB = priorityOrder[b.priority] ?? 1;

    return priorityA - priorityB;
  });
}

/* =========================
   ROUTES - PAGES
========================= */

app.get("/", (req, res) => {
  res.render("index");
});

// Your original "index" route (task page)
app.get("/task-management", (req, res) => {
  const sortedTasks = sortTasks([...tasks]);
  const tasksWithDays = sortedTasks.map((task) => ({
    ...task,
    daysUntil: calculateDaysUntil(task.deadline),
  }));

  // If your navbar expects /prioritization to be the task page, you can also redirect:
  // return res.redirect("/prioritization");

  res.render("task-management", { tasks: tasksWithDays, message: null });
});

// New feature pages
app.get("/build", (req, res) => {
  res.render("build"); // renders views/build.ejs
});
app.get("/investing", (req, res) => res.render("investing"));
app.get("/budgeting", (req, res) => res.render("budgeting"));
app.get("/careers", (req, res) => res.render("careers"));
app.get("/interviews", (req, res) => res.render("interviews"));
app.get("/prioritization", (req, res) => {
  // If your prioritization page IS your task manager, render index instead:
  const sortedTasks = sortTasks([...tasks]);
  const tasksWithDays = sortedTasks.map((task) => ({
    ...task,
    daysUntil: calculateDaysUntil(task.deadline),
  }));
  res.render("task-management", { tasks: tasksWithDays, message: null });
});

/* =========================
   ROUTES - TASK UPLOAD/CRUD
========================= */

app.post("/upload", upload.single("excelFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.render("task-management", { tasks: [], message: "No file uploaded" });
    }

    const filePath = req.file.path;
    tasks = parseExcelFile(filePath);

    const sortedTasks = sortTasks([...tasks]);
    const tasksWithDays = sortedTasks.map((task) => ({
      ...task,
      daysUntil: calculateDaysUntil(task.deadline),
    }));

    res.render("task-management", {
      tasks: tasksWithDays,
      message: `Successfully uploaded ${tasks.length} tasks!`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.render("task-management", { tasks: [], message: "Error uploading file: " + error.message });
  }
});

app.post("/delete-task", (req, res) => {
  try {
    const { taskName, deadline } = req.body;

    const taskIndex = tasks.findIndex(
      (t) => t.task === taskName && t.deadline === deadline
    );

    if (taskIndex === -1) {
      return res.json({ error: "Task not found" });
    }

    tasks.splice(taskIndex, 1);

    const sortedTasks = sortTasks([...tasks]);
    const tasksWithDays = sortedTasks.map((task) => ({
      ...task,
      daysUntil: calculateDaysUntil(task.deadline),
    }));

    res.json({ success: true, tasks: tasksWithDays });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.json({ error: "Error deleting task: " + error.message });
  }
});

app.post("/add-task", (req, res) => {
  try {
    const { task, priority, deadline } = req.body;

    if (!task || !priority || !deadline) {
      return res.json({ error: "All fields are required" });
    }

    tasks.push({
      task: task.trim(),
      priority,
      deadline,
    });

    const sortedTasks = sortTasks([...tasks]);
    const tasksWithDays = sortedTasks.map((t) => ({
      ...t,
      daysUntil: calculateDaysUntil(t.deadline),
    }));

    res.json({ success: true, tasks: tasksWithDays, message: "Task added successfully!" });
  } catch (error) {
    console.error("Error adding task:", error);
    res.json({ error: "Error adding task: " + error.message });
  }
});

app.get("/download", (req, res) => {
  try {
    if (tasks.length === 0) {
      return res.json({ error: "No tasks to download" });
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const fileName = `tasks_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, "uploads", fileName);

    XLSX.writeFile(workbook, filePath);

    res.download(filePath, "tasks.xlsx", (err) => {
      if (err) console.error("Error downloading file:", err);

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.json({ error: "Error generating file: " + error.message });
  }
});

/* =========================
   ROUTES - CHAT (n8n)
========================= */

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    const n8nWebhookUrl = "https://n8ngc.codeblazar.org/webhook/chat";

    const response = await axios.post(
      n8nWebhookUrl,
      { chatInput: message },
      { headers: { "Content-Type": "application/json" }, timeout: 60000 }
    );

    const reply = response.data?.response || "No response from chatbot";
    res.json({ reply });
  } catch (error) {
    console.error("❌ n8n chatbot error:", error.message);
    res.status(500).json({ error: "Error communicating with chatbot" });
  }
});

// n8n Task Assistant Chatbot - GET request
app.get("/n8n-chatbot", async (req, res) => {
  try {
    const { message, userMessage, chatInput, query } = req.query;
    const userQuery = message || userMessage || chatInput || query;

    if (!userQuery) {
      return res.status(400).json({
        error: "No message provided. Use ?message=your_query or ?userMessage=your_query",
      });
    }

    const n8nWebhookUrl =
      "https://n8ngc.codeblazar.org/webhook/cf707f2e-5a12-45ae-9a06-803c524f87c9/chat";

    const response = await axios.get(n8nWebhookUrl, {
      params: { userMessage: userQuery, message: userQuery, chatInput: userQuery },
      timeout: 60000,
    });

    if (response.data?.message === "Workflow was started") {
      return res.json({
        success: true,
        reply:
          "Workflow started but webhook is async. Set n8n webhook to 'Respond Immediately' for instant replies.",
        userMessage: userQuery,
        workflowStarted: true,
        fullResponse: response.data,
      });
    }

    const botResponse =
      response.data?.response || response.data?.output || response.data?.message || "No response";
    const success = response.data?.success !== false;

    res.json({
      success,
      reply: botResponse,
      userMessage: response.data?.userMessage || userQuery,
      fullResponse: response.data,
    });
  } catch (error) {
    console.error("❌ n8n Task Assistant error:", error.message);

    let userFriendlyMessage = "Error communicating with n8n task assistant";
    if (error.response?.data?.message?.includes("Unused Respond to Webhook")) {
      userFriendlyMessage =
        'n8n workflow configuration error: "Respond to Webhook" node is not connected properly.';
    } else if (error.response?.data?.message === "Workflow was started") {
      userFriendlyMessage =
        "Workflow started but configured async. Set webhook to 'Respond Immediately' in n8n.";
    }

    res.status(500).json({
      success: false,
      error: userFriendlyMessage,
      details: error.message,
      status: error.response?.status,
      n8nMessage: error.response?.data?.message,
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
