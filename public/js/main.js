// Task Management Client-Side JavaScript

/* =========================
   UPLOAD FORM HANDLER
========================= */
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file');
    return;
  }
  
  formData.append('excelFile', file);
  
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      // Reload the page to show updated tasks
      window.location.reload();
    } else {
      alert('Error uploading file');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading file: ' + error.message);
  }
});

/* =========================
   ADD TASK FORM HANDLER
========================= */
document.getElementById('addTaskForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const taskData = {
    task: formData.get('task'),
    priority: formData.get('priority'),
    deadline: formData.get('deadline')
  };
  
  try {
    const response = await fetch('/add-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Reload the page to show updated tasks
      window.location.reload();
    } else {
      alert(result.error || 'Error adding task');
    }
  } catch (error) {
    console.error('Add task error:', error);
    alert('Error adding task: ' + error.message);
  }
});

/* =========================
   DELETE TASK FUNCTION
========================= */
async function deleteTask(taskName, deadline) {
  if (!confirm(`Are you sure you want to delete "${taskName}"?`)) {
    return;
  }
  
  try {
    const response = await fetch('/delete-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        taskName: taskName,
        deadline: deadline
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Reload the page to show updated tasks
      window.location.reload();
    } else {
      alert(result.error || 'Error deleting task');
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Error deleting task: ' + error.message);
  }
}

/* =========================
   DOWNLOAD EXCEL FUNCTION
========================= */
async function downloadExcel() {
  try {
    const response = await fetch('/download');
    
    if (!response.ok) {
      const result = await response.json();
      alert(result.error || 'Error downloading file');
      return;
    }
    
    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.xlsx';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    alert('Error downloading file: ' + error.message);
  }
}

// Make functions globally available
window.deleteTask = deleteTask;
window.downloadExcel = downloadExcel;

/* =========================
   INTERVIEW PRACTICE CODE
========================= */

// ============ Helpers ============
const $ = (id) => document.getElementById(id);

function setTempText(btn, text, resetText, ms = 1200) {
  if (!btn) return;
  const prev = btn.textContent;
  btn.textContent = text;
  setTimeout(() => (btn.textContent = resetText ?? prev), ms);
}

function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// ============ Question Bank ============
const questionBank = [
  { text: "Tell me about a time you disagreed with a teammate. How did you handle it?", category: "Behavioral", difficulty: "Medium" },
  { text: "Walk me through a project you led from concept to delivery.", category: "Behavioral", difficulty: "Hard" },
  { text: "How do you prioritize tasks when everything feels urgent?", category: "Situational", difficulty: "Medium" },
  { text: "Why are you interested in this role at our company?", category: "Culture-fit", difficulty: "Easy" },
  { text: "Describe a time you used data to make a decision — what was the outcome?", category: "Technical", difficulty: "Medium" },
  { text: "Tell me about a challenge you faced and how you resolved it.", category: "Behavioral", difficulty: "Medium" },
  { text: "How do you handle feedback and change your approach?", category: "Leadership", difficulty: "Easy" },
  { text: "Give an example of when you had to learn a new skill quickly.", category: "Situational", difficulty: "Easy" },
  { text: "What programming languages are you familiar with?", category: "Technical", difficulty: "Easy" },
  { text: "Describe your leadership style.", category: "Leadership", difficulty: "Medium" },
  { text: "Tell me about a time you failed and what you learned.", category: "Behavioral", difficulty: "Hard" },
  { text: "How do you handle working under pressure?", category: "Situational", difficulty: "Easy" }
];

let currentIndex = 0;
let filteredQuestions = [...questionBank];

// ============ Role Setup ============
function readRoleFromForm() {
  return {
    title: $("role-title") ? $("role-title").value.trim() : "",
    seniority: $("role-seniority") ? $("role-seniority").value : "intern",
    industry: $("role-industry") ? $("role-industry").value.trim() : "",
    location: $("role-location") ? $("role-location").value.trim() : "",
    desc: $("role-desc") ? $("role-desc").value.trim() : "",
    skills: $("role-skills")
      ? $("role-skills").value.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
  };
}

function writeRoleToForm(role) {
  if (!role) return;
  if ($("role-title")) $("role-title").value = role.title || "";
  if ($("role-seniority")) $("role-seniority").value = role.seniority || "intern";
  if ($("role-industry")) $("role-industry").value = role.industry || "";
  if ($("role-location")) $("role-location").value = role.location || "";
  if ($("role-desc")) $("role-desc").value = role.desc || "";
  if ($("role-skills")) $("role-skills").value = Array.isArray(role.skills) ? role.skills.join(", ") : "";
}

function getRoleContext() {
  return safeJSONParse(localStorage.getItem("current_role") || "null", null);
}

function saveRole() {
  const role = readRoleFromForm();
  localStorage.setItem("current_role", JSON.stringify(role));
  return role;
}

// ============ Question Filtering ============
function getCurrentQuestion() {
  if (!filteredQuestions.length) return null;
  return filteredQuestions[currentIndex % filteredQuestions.length];
}

function applyFilters() {
  const categorySelect = $("question-category");
  const difficultySelect = $("question-difficulty");
  
  if (!categorySelect || !difficultySelect) {
    filteredQuestions = [...questionBank];
    currentIndex = 0;
    return;
  }

  const cat = categorySelect.value;
  const diff = difficultySelect.value;

  // Try exact match
  let list = questionBank.filter((q) => q.category === cat && q.difficulty === diff);

  // Fallback: category only
  if (!list.length) list = questionBank.filter((q) => q.category === cat);

  // Fallback: everything
  if (!list.length) list = [...questionBank];

  filteredQuestions = list;
  currentIndex = 0;
}

function renderQuestion() {
  const qText = $("question-text");
  const answerEl = $("answer");
  
  if (!qText) return;

  const q = getCurrentQuestion();
  if (!q) {
    qText.textContent = "No questions match the selected category/difficulty.";
    if (answerEl) answerEl.value = "";
    updateWordCount();
    return;
  }

  qText.textContent = q.text;

  // Load saved answer for that question
  const saved = localStorage.getItem(`answer_${q.text}`);
  if (answerEl) answerEl.value = saved || "";

  updateWordCount();
}

// ============ Word Count ============
function updateWordCount() {
  const answerEl = $("answer");
  const wordCountEl = $("word-count");
  
  if (!answerEl || !wordCountEl) return;
  const val = answerEl.value.trim();
  wordCountEl.textContent = val ? val.split(/\s+/).length : 0;
}

// ============ Feedback & Grading ============
function analyzeAnswer(text) {
  const tips = [];
  const len = (text || "").trim().length;

  if (len < 40) tips.push("Answer is short — add concrete details or metrics (try 60–120 words).");
  if (len > 600) tips.push("Answer is very long — aim for concise storytelling (1–2 minutes spoken).");
  if (!/\b(I|we)\b/i.test(text)) tips.push("Use first-person language to show ownership (I, we).");
  if (/\b(um|uh|like|you know|so\s+basically)\b/i.test(text)) tips.push("Reduce filler words; practice pausing instead.");
  if (!/\b(result|impact|outcome|deliverable|saved|reduced|increased|improved)\b/i.test(text))
    tips.push("State the result/impact and add numbers when possible.");

  const hasSTAR = /situation|task|action|result/i.test(text);
  if (!hasSTAR) tips.push("Try structuring the answer with STAR: Situation, Task, Action, Result.");

  if (!/\d{2,}|%|\$|k\b/i.test(text)) tips.push('Include metrics if possible (e.g., "30%", "$5k", "2 days").');

  if (!/\b(my role|I (led|owned|managed)|as a|as the)\b/i.test(text))
    tips.push("Clarify your role and responsibilities (what you did, not just the team).");

  tips.push("Practice aloud and record yourself to improve pacing and remove filler words.");
  return tips;
}

function gradeAnswer(text) {
  const rubric = { STAR: 0, clarity: 0, specificity: 0, impact: 0, relevance: 1, confidence: 0 };
  const lower = (text || "").toLowerCase();

  if (/situation|task|action|result/.test(lower)) rubric.STAR = 1;
  rubric.clarity = (text || "").trim().length > 40 ? 1 : 0;
  rubric.specificity = /\d+|%|\$/.test(text) ? 1 : 0;
  rubric.impact = /result|impact|outcome|improved|reduced|increased/.test(lower) ? 1 : 0;
  rubric.confidence = !/\b(um|uh|like|you know)\b/i.test(text) ? 1 : 0;

  const score = Math.round(
    (Object.values(rubric).reduce((a, b) => a + b, 0) / Object.keys(rubric).length) * 100
  );

  const missing = [];
  if (!rubric.STAR) missing.push("STAR structure");
  if (!rubric.specificity) missing.push("metrics/numbers");
  if (!rubric.impact) missing.push("clear result");

  return { score, rubric, missing };
}

function generateImprovedAnswer(original, roleContext) {
  const parts = [];
  if (roleContext) {
    parts.push(`Context: Role=${roleContext.title || "—"} (${roleContext.seniority || "—"}), Location=${roleContext.location || "—"}`);
    parts.push("");
  }
  parts.push("Situation: [Briefly describe the context]");
  parts.push("Task: [What needed to be done]");
  parts.push("Action: [What you specifically did]");
  parts.push("Result: [Outcome and metrics if available]");

  if (original && original.trim().length) {
    parts.push("");
    parts.push("Original answer for reference:");
    parts.push(original.trim());
  }

  return parts.join("\n");
}

// ============ Sessions ============
function saveSession() {
  const role = getRoleContext();
  const q = getCurrentQuestion() || { text: "-" };
  const answerEl = $("answer");
  const feedbackList = $("feedback-list");
  const rubricScore = $("rubric-score");
  const negOutput = $("neg-output");

  const feedback = Array.from(feedbackList?.querySelectorAll("li") || []).map((li) => li.textContent);
  const score = rubricScore ? rubricScore.textContent : "Score: —";
  const scripts = negOutput ? negOutput.textContent : "";

  const session = {
    id: Date.now(),
    role,
    question: q.text,
    answer: answerEl ? answerEl.value : "",
    feedback,
    score,
    scripts,
    when: new Date().toISOString(),
  };

  const sessions = safeJSONParse(localStorage.getItem("offerup_sessions") || "[]", []);
  sessions.unshift(session);
  localStorage.setItem("offerup_sessions", JSON.stringify(sessions.slice(0, 20)));
}

function renderSessions() {
  const sessions = safeJSONParse(localStorage.getItem("offerup_sessions") || "[]", []);
  const sessionsEl = $("sessions");
  const sessionListWrap = $("session-list");
  
  if (sessionsEl) sessionsEl.innerHTML = "";

  if (!sessions.length) {
    if (sessionsEl) sessionsEl.innerHTML = "<li>No sessions</li>";
    if (sessionListWrap) sessionListWrap.hidden = false;
    return;
  }

  sessions.forEach((s) => {
    const li = document.createElement("li");
    const when = s.when ? new Date(s.when).toLocaleString() : "";
    const title = s.role?.title ? s.role.title : "—";
    li.textContent = `${when} — ${title} — ${s.question}`;
    if (sessionsEl) sessionsEl.appendChild(li);
  });

  if (sessionListWrap) sessionListWrap.hidden = false;
}

// ============ Timer ============
let timerInterval = null;
let timerSeconds = 0;

function renderTimer() {
  const timerDisplay = $("timer-display");
  if (!timerDisplay) return;
  const m = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
  const s = (timerSeconds % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerSeconds++;
    renderTimer();
  }, 1000);
}

function pauseTimer() {
  if (!timerInterval) return;
  clearInterval(timerInterval);
  timerInterval = null;
}

// ============ Negotiation Scripts ============
function parseSalary(s) {
  if (!s) return null;
  const num = Number(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(num) ? num : null;
}

function formatSalary(n) {
  if (n == null) return "";
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function buildNegotiationScript() {
  const name = $("neg-name") ? $("neg-name").value.trim() : "Your name";
  const role = $("neg-role") ? $("neg-role").value.trim() : "Role";
  const company = $("neg-company") ? $("neg-company").value.trim() : "Company";
  const offeredRaw = $("neg-salary") ? $("neg-salary").value.trim() : "";
  const desiredRaw = $("neg-desired") ? $("neg-desired").value.trim() : "";
  const tone = $("neg-tone") ? $("neg-tone").value || "professional" : "professional";

  const offered = parseSalary(offeredRaw);
  const desired = parseSalary(desiredRaw);
  const suggested = desired || (offered ? Math.round(offered * 1.1) : null);

  const templates = {
    professional: {
      subject: `Regarding the ${role} offer`,
      opener: `Hi ${company} team,\n\nThank you for the ${role} offer and for the time you've spent with me during the interview process. I'm excited about the opportunity and the team.`,
      body: suggested
        ? `Based on the responsibilities and market research, I'm targeting ${formatSalary(suggested)}. Would you be open to discussing compensation or benefits to bridge to that range?`
        : `I'd appreciate the chance to discuss compensation and the full package.`,
      closer: `Thank you for considering — I'm happy to discuss further.\n\nBest regards,\n${name}`,
    },
    friendly: {
      subject: `Quick note about the ${role} offer`,
      opener: `Hi ${company} team,\n\nThanks so much for the offer — I'm really excited about the role and the people I met.`,
      body: suggested
        ? `I'd be hoping for around ${formatSalary(suggested)} given the scope and my experience. Is there room to discuss salary or extra benefits to get closer to that?`
        : `Would love to chat about the compensation and any other parts of the package.`,
      closer: `Appreciate your time — looking forward to hearing from you.\n\nThanks,\n${name}`,
    },
    direct: {
      subject: `Salary discussion for ${role} offer`,
      opener: `Hello ${company} team,\n\nThank you for the offer. I'm interested in moving forward, but want to confirm compensation expectations.`,
      body: suggested
        ? `I am targeting ${formatSalary(suggested)} based on market data and my experience. Please let me know if that is feasible or what flexibility exists.`
        : `Please let me know what flexibility exists in the compensation package.`,
      closer: `Regards,\n${name}`,
    },
  };

  const t = templates[tone] || templates.professional;
  const email = `${t.subject}\n\n${t.opener}\n\n${t.body}\n\n${t.closer}`;
  const talkingPoints =
    `Talking points:\n` +
    `- Thank them and express enthusiasm.\n` +
    `- State target (${suggested ? formatSalary(suggested) : "state your target clearly"}).\n` +
    `- Brief rationale: experience, scope, market data.\n` +
    `- Ask about flexibility, alternatives (signing bonus, equity, vacation).`;

  return email + "\n\n" + talkingPoints;
}

async function copyText(text) {
  if (!text) throw new Error("Nothing to copy");
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // fallback for http/permissions
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

// ============ Event Listeners ============
// Previous question
$("prev-q")?.addEventListener("click", () => {
  if (!filteredQuestions.length) return;
  currentIndex = (currentIndex - 1 + filteredQuestions.length) % filteredQuestions.length;
  renderQuestion();
});

// Next question
$("next-q")?.addEventListener("click", () => {
  if (!filteredQuestions.length) return;
  currentIndex = (currentIndex + 1) % filteredQuestions.length;
  renderQuestion();
});

// Category & Difficulty filters
$("question-category")?.addEventListener("change", () => {
  applyFilters();
  renderQuestion();
});

$("question-difficulty")?.addEventListener("change", () => {
  applyFilters();
  renderQuestion();
});

// Answer input
$("answer")?.addEventListener("input", updateWordCount);

// Submit answer for feedback
$("submit-answer")?.addEventListener("click", () => {
  const text = $("answer") ? $("answer").value || "" : "";
  const tips = analyzeAnswer(text);

  const feedbackList = $("feedback-list");
  if (feedbackList) feedbackList.innerHTML = "";
  
  tips.forEach((t) => {
    if (!feedbackList) return;
    const li = document.createElement("li");
    li.textContent = t;
    feedbackList.appendChild(li);
  });

  const grade = gradeAnswer(text);
  const rubricScore = $("rubric-score");
  if (rubricScore) rubricScore.textContent = `Score: ${grade.score}%`;

  if (grade.missing.length && feedbackList) {
    const li = document.createElement("li");
    li.textContent = "Missing: " + grade.missing.join("; ");
    feedbackList.appendChild(li);
  }

  const roleContext = getRoleContext();
  const improvedText = $("improved-text");
  if (improvedText) improvedText.textContent = generateImprovedAnswer(text, roleContext);

  setTempText($("submit-answer"), "Done ✅", "Get Feedback");
});

// Save answer locally
$("save-answer")?.addEventListener("click", () => {
  const q = getCurrentQuestion();
  if (!q) {
    alert("No question selected.");
    return;
  }
  const answerEl = $("answer");
  localStorage.setItem(`answer_${q.text}`, answerEl ? answerEl.value || "" : "");
  setTempText($("save-answer"), "Saved ✅", "Save Locally");
});

// Export answers
$("export-answers")?.addEventListener("click", () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("answer_")) data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "interview_answers.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  setTempText($("export-answers"), "Exported ✅", "Export Answers");
});

// Import answers
$("import-answers")?.addEventListener("click", () => {
  $("import-file")?.click();
});

$("import-file")?.addEventListener("change", async (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;

  try {
    const text = await f.text();
    const obj = JSON.parse(text);

    Object.keys(obj).forEach((k) => {
      if (k.startsWith("answer_")) localStorage.setItem(k, obj[k]);
    });

    renderQuestion();
    setTempText($("import-answers"), "Imported ✅", "Import Answers");
  } catch (err) {
    alert("Failed to import: " + err.message);
  }

  $("import-file").value = "";
});

// Save session
$("save-session")?.addEventListener("click", () => {
  saveSession();
  setTempText($("save-session"), "Saved ✅", "Save Session");
});

// View sessions
$("view-sessions")?.addEventListener("click", () => {
  renderSessions();
  setTempText($("view-sessions"), "Shown ✅", "View Sessions");
});

// Export top feedback
$("export-top")?.addEventListener("click", () => {
  const role = getRoleContext();
  const feedbackList = $("feedback-list");
  const lastFeedback = Array.from(feedbackList?.querySelectorAll("li") || [])
    .map((li) => li.textContent)
    .slice(0, 8)
    .join("\n");

  const negOutput = $("neg-output");
  const scripts = negOutput ? negOutput.textContent || "" : "";
  
  const content = [
    `Role: ${role ? `${role.title || "—"} (${role.seniority || "—"})` : "—"}`,
    "",
    "Top Feedback:",
    lastFeedback || "—",
    "",
    "Generated Scripts:",
    scripts || "—",
  ].join("\n\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "interview_export.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  setTempText($("export-top"), "Exported ✅", "Export Top Feedback & Scripts");
});

// Save role
$("save-role")?.addEventListener("click", () => {
  saveRole();
  setTempText($("save-role"), "Saved ✅", "Save Role");
});

// Start practicing
$("start-practice")?.addEventListener("click", () => {
  if (!localStorage.getItem("current_role")) saveRole();
  applyFilters();
  renderQuestion();
  $("interview-practice")?.scrollIntoView({ behavior: "smooth" });
  setTempText($("start-practice"), "Going… ✅", "Start Practicing", 900);
});

// Timer controls
$("timer-start")?.addEventListener("click", () => {
  startTimer();
  setTempText($("timer-start"), "Running…", "Start", 800);
});

$("timer-pause")?.addEventListener("click", () => {
  pauseTimer();
  setTempText($("timer-pause"), "Paused ✅", "Pause", 800);
});

// Record mode toggle
$("record-toggle")?.addEventListener("click", () => {
  alert("Record mode placeholder — audio recording not implemented in this MVP.");
});

// Negotiation script generation
$("generate-neg")?.addEventListener("click", () => {
  const script = buildNegotiationScript();
  const negOutput = $("neg-output");
  if (negOutput) negOutput.textContent = script;
  setTempText($("generate-neg"), "Generated ✅", "Generate Script");
});

// Copy negotiation script
$("copy-neg")?.addEventListener("click", async () => {
  try {
    const negOutput = $("neg-output");
    const txt = negOutput ? negOutput.textContent || "" : "";
    await copyText(txt);
    setTempText($("copy-neg"), "Copied! ✅", "Copy");
  } catch {
    setTempText($("copy-neg"), "Copy failed", "Copy");
  }
});

// ============ Initialization ============
document.addEventListener("DOMContentLoaded", () => {
  // Load role if exists
  const savedRole = getRoleContext();
  if (savedRole) writeRoleToForm(savedRole);

  // Apply initial filters and show first question
  applyFilters();
  renderQuestion();

  // Init timer display
  renderTimer();

  // Expose debug handle
  window.OfferUpCoach = {
    questionBank,
    applyFilters,
    getCurrentQuestion,
  };
});