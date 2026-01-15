/* public/js/app.js
   OfferUp Coach — Client-side logic for index.ejs
   ✅ All buttons wired
   ✅ No crashes when filters return 0
   ✅ Timer Start/Pause works (pause resumes properly)
   ✅ Role saved + auto-loads into fields
   ✅ Question nav + filtering + saved answers per-question
   ✅ Feedback + scoring + improved answer template
   ✅ Export/Import answers JSON
   ✅ Sessions save/view
   ✅ Negotiation script generator + Copy (with fallback)
*/

(() => {
  // Because script is loaded with `defer`, DOM is ready here.
  console.log("[OfferUpCoach] app.js loaded ✅");

  // -----------------------------
  // Helpers
  // -----------------------------
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

  // -----------------------------
  // Question Bank (you can expand)
  // -----------------------------
  const questionBank = [
    { text: "Tell me about a time you disagreed with a teammate. How did you handle it?", category: "Behavioral", difficulty: "Medium" },
    { text: "Walk me through a project you led from concept to delivery.", category: "Behavioral", difficulty: "Hard" },
    { text: "How do you prioritize tasks when everything feels urgent?", category: "Situational", difficulty: "Medium" },
    { text: "Why are you interested in this role at our company?", category: "Culture-fit", difficulty: "Easy" },
    { text: "Describe a time you used data to make a decision — what was the outcome?", category: "Technical", difficulty: "Medium" },
    { text: "Tell me about a challenge you faced and how you resolved it.", category: "Behavioral", difficulty: "Medium" },
    { text: "How do you handle feedback and change your approach?", category: "Leadership", difficulty: "Easy" },
    { text: "Give an example of when you had to learn a new skill quickly.", category: "Situational", difficulty: "Easy" },
  ];

  let currentIndex = 0;
  let filteredQuestions = [...questionBank];

  // -----------------------------
  // DOM refs
  // -----------------------------
  const qText = $("question-text");
  const prevBtn = $("prev-q");
  const nextBtn = $("next-q");

  const categorySelect = $("question-category");
  const difficultySelect = $("question-difficulty");

  const answerEl = $("answer");
  const submitBtn = $("submit-answer");
  const saveBtn = $("save-answer");
  const exportBtn = $("export-answers");
  const importBtn = $("import-answers");
  const importFile = $("import-file");

  const feedbackList = $("feedback-list");
  const rubricScore = $("rubric-score");
  const improvedText = $("improved-text");

  const saveSessionBtn = $("save-session");
  const viewSessionsBtn = $("view-sessions");
  const exportTopBtn = $("export-top");
  const sessionsEl = $("sessions");
  const sessionListWrap = $("session-list");

  const saveRoleBtn = $("save-role");
  const startPracticeBtn = $("start-practice");

  const wordCountEl = $("word-count");

  const timerStartBtn = $("timer-start");
  const timerPauseBtn = $("timer-pause");
  const timerDisplay = $("timer-display");

  const recordToggle = $("record-toggle");

  const genNeg = $("generate-neg");
  const copyNeg = $("copy-neg");
  const negOutput = $("neg-output");
  const negTone = $("neg-tone");
  const negDesired = $("neg-desired");

  // -----------------------------
  // Role Setup (save + load)
  // -----------------------------
  function readRoleFromForm() {
    return {
      title: $("role-title") ? $("role-title").value.trim() : "",
      seniority: $("role-seniority") ? $("role-seniority").value : "intern",
      industry: $("role-industry") ? $("role-industry").value.trim() : "",
      location: $("role-location") ? $("role-location").value.trim() : "",
      desc: $("role-desc") ? $("role-desc").value.trim() : "",
      skills: $("role-skills")
        ? $("role-skills").value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
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

  // -----------------------------
  // Question filtering + rendering
  // -----------------------------
  function getCurrentQuestion() {
    if (!filteredQuestions.length) return null;
    return filteredQuestions[currentIndex % filteredQuestions.length];
  }

  function applyFilters() {
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
    if (!qText) return;

    const q = getCurrentQuestion();
    if (!q) {
      qText.textContent = "No questions match the selected category/difficulty.";
      if (answerEl) answerEl.value = "";
      updateWordCount();
      return;
    }

    qText.textContent = q.text;

    // Load saved answer for that question (if any)
    const saved = localStorage.getItem(`answer_${q.text}`);
    if (answerEl) answerEl.value = saved || "";

    updateWordCount();
  }

  // -----------------------------
  // Word count
  // -----------------------------
  function updateWordCount() {
    if (!answerEl || !wordCountEl) return;
    const val = answerEl.value.trim();
    wordCountEl.textContent = val ? val.split(/\s+/).length : 0;
  }

  // -----------------------------
  // Feedback logic
  // -----------------------------
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
    if (!rubric.STAR) missing.push("STAR structure (Situation, Task, Action, Result)");
    if (!rubric.specificity) missing.push("Specific metrics or numbers");
    if (!rubric.impact) missing.push("Clear result or impact");

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

  // -----------------------------
  // Local answer storage
  // -----------------------------
  function gatherSavedAnswers() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("answer_")) data[key] = localStorage.getItem(key);
    }
    return data;
  }

  // -----------------------------
  // Sessions
  // -----------------------------
  function saveSession() {
    const role = getRoleContext();
    const q = getCurrentQuestion() || { text: "-" };
    const feedback = Array.from(document.querySelectorAll("#feedback-list li")).map((li) => li.textContent);
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

  // -----------------------------
  // Timer (Start / Pause)
  // -----------------------------
  let timerInterval = null;
  let timerSeconds = 0;

  function renderTimer() {
    if (!timerDisplay) return;
    const m = Math.floor(timerSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (timerSeconds % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${m}:${s}`;
  }

  function startTimer() {
    if (timerInterval) return; // prevent double speed
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

  // -----------------------------
  // Negotiation scripts
  // -----------------------------
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
    const desiredRaw = negDesired ? negDesired.value.trim() : "";
    const tone = negTone ? negTone.value || "professional" : "professional";

    const offered = parseSalary(offeredRaw);
    const desired = parseSalary(desiredRaw);
    const suggested = desired || (offered ? Math.round(offered * 1.1) : null);

    const templates = {
      professional: {
        subject: `Regarding the ${role} offer`,
        opener: `Hi ${company} team,\n\nThank you for the ${role} offer and for the time you've spent with me during the interview process. I’m excited about the opportunity and the team.`,
        body: suggested
          ? `Based on the responsibilities and market research, I’m targeting ${formatSalary(
              suggested
            )}. Would you be open to discussing compensation or benefits to bridge to that range?`
          : `I’d appreciate the chance to discuss compensation and the full package.`,
        closer: `Thank you for considering — I’m happy to discuss further.\n\nBest regards,\n${name}`,
      },
      friendly: {
        subject: `Quick note about the ${role} offer`,
        opener: `Hi ${company} team,\n\nThanks so much for the offer — I’m really excited about the role and the people I met.`,
        body: suggested
          ? `I’d be hoping for around ${formatSalary(
              suggested
            )} given the scope and my experience. Is there room to discuss salary or extra benefits to get closer to that?`
          : `Would love to chat about the compensation and any other parts of the package.`,
        closer: `Appreciate your time — looking forward to hearing from you.\n\nThanks,\n${name}`,
      },
      direct: {
        subject: `Salary discussion for ${role} offer`,
        opener: `Hello ${company} team,\n\nThank you for the offer. I’m interested in moving forward, but want to confirm compensation expectations.`,
        body: suggested
          ? `I am targeting ${formatSalary(
              suggested
            )} based on market data and my experience. Please let me know if that is feasible or what flexibility exists.`
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
    // Clipboard can fail on http / permissions; include fallback.
    if (!text) throw new Error("Nothing to copy");
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // fallback
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

  // -----------------------------
  // Wire up events
  // -----------------------------
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      if (!filteredQuestions.length) return;
      currentIndex = (currentIndex - 1 + filteredQuestions.length) % filteredQuestions.length;
      renderQuestion();
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      if (!filteredQuestions.length) return;
      currentIndex = (currentIndex + 1) % filteredQuestions.length;
      renderQuestion();
    });

  if (categorySelect)
    categorySelect.addEventListener("change", () => {
      applyFilters();
      renderQuestion();
    });

  if (difficultySelect)
    difficultySelect.addEventListener("change", () => {
      applyFilters();
      renderQuestion();
    });

  if (answerEl) answerEl.addEventListener("input", updateWordCount);

  if (submitBtn)
    submitBtn.addEventListener("click", () => {
      const text = answerEl ? answerEl.value || "" : "";
      const tips = analyzeAnswer(text);

      if (feedbackList) feedbackList.innerHTML = "";
      tips.forEach((t) => {
        if (!feedbackList) return;
        const li = document.createElement("li");
        li.textContent = t;
        feedbackList.appendChild(li);
      });

      const grade = gradeAnswer(text);
      if (rubricScore) rubricScore.textContent = `Score: ${grade.score}%`;

      if (grade.missing.length && feedbackList) {
        const li = document.createElement("li");
        li.textContent = "Missing: " + grade.missing.join("; ");
        feedbackList.appendChild(li);
      }

      const roleContext = getRoleContext();
      if (improvedText) improvedText.textContent = generateImprovedAnswer(text, roleContext);

      setTempText(submitBtn, "Done ✅", "Get Feedback");
    });

  if (saveBtn)
    saveBtn.addEventListener("click", () => {
      const q = getCurrentQuestion();
      if (!q) {
        alert("No question selected. Change category/difficulty first.");
        return;
      }

      localStorage.setItem(`answer_${q.text}`, answerEl ? answerEl.value || "" : "");
      setTempText(saveBtn, "Saved ✅", "Save Locally");
    });

  if (exportBtn)
    exportBtn.addEventListener("click", () => {
      const data = gatherSavedAnswers();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "offerup_coach_answers.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setTempText(exportBtn, "Exported ✅", "Export Answers");
    });

  if (importBtn && importFile) importBtn.addEventListener("click", () => importFile.click());

  if (importFile)
    importFile.addEventListener("change", async (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;

      try {
        const text = await f.text();
        const obj = JSON.parse(text);

        Object.keys(obj).forEach((k) => {
          if (k.startsWith("answer_")) localStorage.setItem(k, obj[k]);
        });

        renderQuestion();
        setTempText(importBtn, "Imported ✅", "Import Answers");
      } catch (err) {
        alert("Failed to import: " + err.message);
      }

      importFile.value = "";
    });

  if (saveSessionBtn)
    saveSessionBtn.addEventListener("click", () => {
      saveSession();
      setTempText(saveSessionBtn, "Saved ✅", "Save Session");
    });

  if (viewSessionsBtn)
    viewSessionsBtn.addEventListener("click", () => {
      renderSessions();
      setTempText(viewSessionsBtn, "Shown ✅", "View Sessions");
    });

  if (exportTopBtn)
    exportTopBtn.addEventListener("click", () => {
      const role = getRoleContext();
      const lastFeedback = Array.from(document.querySelectorAll("#feedback-list li"))
        .map((li) => li.textContent)
        .slice(0, 8)
        .join("\n");

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
      a.download = "offerup_coach_export.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setTempText(exportTopBtn, "Exported ✅", "Export Top Feedback & Scripts");
    });

  if (saveRoleBtn)
    saveRoleBtn.addEventListener("click", () => {
      saveRole();
      setTempText(saveRoleBtn, "Saved ✅", "Save Role");
    });

  if (startPracticeBtn)
    startPracticeBtn.addEventListener("click", () => {
      // Ensure role is saved so improved answer has context
      if (!localStorage.getItem("current_role")) saveRole();
      applyFilters();
      renderQuestion();
      $("interview-practice")?.scrollIntoView({ behavior: "smooth" });
      setTempText(startPracticeBtn, "Going… ✅", "Start Practicing", 900);
    });

  if (timerStartBtn)
    timerStartBtn.addEventListener("click", () => {
      startTimer();
      setTempText(timerStartBtn, "Running…", "Start", 800);
    });

  if (timerPauseBtn)
    timerPauseBtn.addEventListener("click", () => {
      pauseTimer();
      setTempText(timerPauseBtn, "Paused ✅", "Pause", 800);
    });

  if (recordToggle)
    recordToggle.addEventListener("click", () => {
      alert("Record mode placeholder — audio recording not implemented in this MVP.");
    });

  if (genNeg)
    genNeg.addEventListener("click", () => {
      const script = buildNegotiationScript();
      if (negOutput) negOutput.textContent = script;
      setTempText(genNeg, "Generated ✅", "Generate Script");
    });

  if (copyNeg)
    copyNeg.addEventListener("click", async () => {
      try {
        const txt = negOutput ? negOutput.textContent || "" : "";
        await copyText(txt);
        setTempText(copyNeg, "Copied! ✅", "Copy");
      } catch {
        setTempText(copyNeg, "Copy failed", "Copy");
      }
    });

  // -----------------------------
  // Init UI (match screenshot)
  // -----------------------------
  // Load role if exists
  const savedRole = getRoleContext();
  if (savedRole) writeRoleToForm(savedRole);

  // Apply initial filters and show first question
  applyFilters();
  renderQuestion();

  // Init word count and timer display
  updateWordCount();
  renderTimer();

  // Expose minimal debug handle
  window.OfferUpCoach = {
    questionBank,
    applyFilters,
    getCurrentQuestion,
  };
})();
