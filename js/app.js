// OfferUp Coach - starter interactivity
// - Provides question switching, answer feedback, localStorage save
// - Generates simple negotiation scripts

const questionBank = [
  {text: "Tell me about a time you disagreed with a teammate. How did you handle it?", category: 'Behavioral', difficulty: 'Medium'},
  {text: "Walk me through a project you led from concept to delivery.", category: 'Behavioral', difficulty: 'Hard'},
  {text: "How do you prioritize tasks when everything feels urgent?", category: 'Situational', difficulty: 'Medium'},
  {text: "Why are you interested in this role at our company?", category: 'Culture', difficulty: 'Easy'},
  {text: "Describe a time you used data to make a decision — what was the outcome?", category: 'Technical', difficulty: 'Medium'},
  {text: "Tell me about a challenge you faced and how you resolved it.", category: 'Behavioral', difficulty: 'Medium'},
  {text: "How do you handle feedback and change your approach?", category: 'Leadership', difficulty: 'Easy'},
  {text: "Give an example of when you had to learn a new skill quickly.", category: 'Situational', difficulty: 'Easy'}
];

let currentIndex = 0;
let filteredQuestions = [...questionBank];

// DOM refs
const qText = document.getElementById('question-text');
const prevBtn = document.getElementById('prev-q');
const nextBtn = document.getElementById('next-q');
const answerEl = document.getElementById('answer');
const submitBtn = document.getElementById('submit-answer');
const saveBtn = document.getElementById('save-answer');
const feedbackList = document.getElementById('feedback-list');

// Negotiation refs
const genNeg = document.getElementById('generate-neg');
const copyNeg = document.getElementById('copy-neg');
const negOutput = document.getElementById('neg-output');
const negTone = document.getElementById('neg-tone');
const negDesired = document.getElementById('neg-desired');

function renderQuestion() {
  if (!filteredQuestions.length) {
    qText.textContent = 'No questions match the selected category/difficulty.';
    answerEl.value = '';
    return;
  }
  const q = filteredQuestions[currentIndex % filteredQuestions.length];
  qText.textContent = q.text;
  const saved = localStorage.getItem(`answer_${q.text}`);
  answerEl.value = saved || '';
}

prevBtn.addEventListener('click', () => {
  if (!filteredQuestions.length) return;
  currentIndex = (currentIndex - 1 + filteredQuestions.length) % filteredQuestions.length;
  renderQuestion();
});
nextBtn.addEventListener('click', () => {
  if (!filteredQuestions.length) return;
  currentIndex = (currentIndex + 1) % filteredQuestions.length;
  renderQuestion();
});

// Filters
const categorySelect = document.getElementById('question-category');
const difficultySelect = document.getElementById('question-difficulty');
function applyFilters(){
  const cat = categorySelect.value;
  const diff = difficultySelect.value;
  filteredQuestions = questionBank.filter(q => q.category === cat && q.difficulty === diff);
  currentIndex = 0;
  renderQuestion();
}
categorySelect.addEventListener('change', applyFilters);
difficultySelect.addEventListener('change', applyFilters);

// Simple feedback heuristics
function analyzeAnswer(text) {
  const tips = [];
  const len = text.trim().length;
  if (len < 40) tips.push('Answer is short — add concrete details or metrics (try 60-120 words).');
  if (len > 600) tips.push('Answer is very long — aim for concise storytelling (1–2 minutes spoken).');
  if (!text.match(/\b(I|we)\b/i)) tips.push('Use first-person language to show ownership (I, we).');
  if (text.match(/\b(um|uh|like|you know|so\s+basically)\b/i)) tips.push('Reduce filler words (um, uh, like); practice pausing to emphasize points.');
  if (!text.match(/\b(result|impact|outcome|deliverable|saved|reduced|increased|improved)\b/i)) tips.push('State the result/impact and, when possible, add numbers or percentages.');
  const hasSTAR = /situation|task|action|result/i.test(text);
  if (!hasSTAR) tips.push('Try structuring the answer with STAR: Situation, Task, Action, Result.');
  if (!text.match(/\d{2,}|%|\$|k\b/i)) {
    tips.push('If possible, include specific metrics (e.g., "reduced time by 30%" or "saved $5k").');
  }
  if (!text.match(/\b(my role|I (led|owned|managed)|as a|as the)\b/i)) {
    tips.push('Clarify your role and responsibilities in the story (what you did, not just the team).');
  }
  tips.push('Practice aloud and record yourself to improve pacing and remove filler words.');
  return tips;
}

// Rubric scoring and highlights
function gradeAnswer(text){
  const rubric = {STAR:0, clarity:0, specificity:0, impact:0, relevance:0, confidence:0};
  const lower = text.toLowerCase();
  if (/situation|task|action|result/.test(lower)) rubric.STAR = 1;
  rubric.clarity = text.trim().length > 40 ? 1 : 0;
  rubric.specificity = /\d+|%|\$/.test(text) ? 1 : 0;
  rubric.impact = /result|impact|outcome|improved|reduced|increased/.test(lower) ? 1 : 0;
  rubric.relevance = 1; // assume relevant for now
  rubric.confidence = !/\b(um|uh|like|you know)\b/i.test(text) ? 1 : 0;
  const score = Math.round((Object.values(rubric).reduce((a,b)=>a+b,0) / Object.keys(rubric).length) * 100);
  // missing parts
  const missing = [];
  if (!rubric.STAR) missing.push('STAR structure (Situation, Task, Action, Result)');
  if (!rubric.specificity) missing.push('Specific metrics or numbers');
  if (!rubric.impact) missing.push('Clear result or impact');
  return {score, rubric, missing};
}

function generateImprovedAnswer(original, roleContext){
  // simple rule-based rewrite: enforce STAR order and add placeholders
  const parts = [];
  parts.push('Situation: [Briefly describe the context]');
  parts.push('Task: [What needed to be done]');
  parts.push('Action: [What you specifically did]');
  parts.push('Result: [Outcome and metrics if available]');
  if (original && original.trim().length){
    parts.push('\nOriginal answer for reference:\n' + original.trim());
  }
  if (roleContext) parts.unshift(`Context: Role=${roleContext.title} (${roleContext.seniority}), Location=${roleContext.location}`);
  return parts.join('\n\n');
}

submitBtn.addEventListener('click', () => {
  const text = answerEl.value || '';
  const tips = analyzeAnswer(text);
  feedbackList.innerHTML = '';
  tips.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    feedbackList.appendChild(li);
  });
  const grade = gradeAnswer(text);
  document.getElementById('rubric-score').textContent = `Score: ${grade.score}%`;
  const missingEl = grade.missing.length ? 'Missing: ' + grade.missing.join('; ') : '';
  if (missingEl){
    const li = document.createElement('li'); li.textContent = missingEl; feedbackList.appendChild(li);
  }
  const roleContext = JSON.parse(localStorage.getItem('current_role')||'null');
  document.getElementById('improved-text').textContent = generateImprovedAnswer(text, roleContext);
});

saveBtn.addEventListener('click', () => {
  const q = filteredQuestions[currentIndex % filteredQuestions.length];
  localStorage.setItem(`answer_${q.text}`, answerEl.value || '');
  saveBtn.textContent = 'Saved';
  setTimeout(()=> saveBtn.textContent = 'Save Locally', 1200);
});

// Export / Import answers as JSON
const exportBtn = document.getElementById('export-answers');
const importBtn = document.getElementById('import-answers');
const importFile = document.getElementById('import-file');

function gatherSavedAnswers() {
  const data = {};
  for (let i=0;i<localStorage.length;i++){
    const key = localStorage.key(i);
    if (key && key.startsWith('answer_')) {
      data[key] = localStorage.getItem(key);
    }
  }
  return data;
}

exportBtn.addEventListener('click', () => {
  const data = gatherSavedAnswers();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'offerup_coach_answers.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', ()=> importFile.click());
importFile.addEventListener('change', async (e)=>{
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  try {
    const text = await f.text();
    const obj = JSON.parse(text);
    Object.keys(obj).forEach(k => {
      if (k.startsWith('answer_')) localStorage.setItem(k, obj[k]);
    });
    renderQuestion();
    alert('Imported answers into Local Storage.');
  } catch (err) {
    alert('Failed to import: ' + err.message);
  }
  importFile.value = '';
});

// Optional: sync to backend if available
async function syncToServer() {
  try {
    const res = await fetch('/api/answers', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(gatherSavedAnswers())
    });
    if (res.ok) console.log('Synced to server');
  } catch (e) {
    // silently ignore if server not present
  }
}

// Negotiation generator
genNeg.addEventListener('click', () => {
  const name = document.getElementById('neg-name').value.trim() || 'Your name';
  const role = document.getElementById('neg-role').value.trim() || 'Role';
  const company = document.getElementById('neg-company').value.trim() || 'Company';
  const offeredRaw = document.getElementById('neg-salary').value.trim();
  const desiredRaw = negDesired.value.trim();
  const tone = negTone.value || 'professional';

  function parseSalary(s) {
    if (!s) return null;
    // remove currency/commas
    const num = Number(s.replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) ? num : null;
  }

  function formatSalary(n) {
    if (n == null) return '';
    return '$' + n.toLocaleString(undefined, {maximumFractionDigits:0});
  }

  const offered = parseSalary(offeredRaw);
  const desired = parseSalary(desiredRaw);

  // compute suggested target: prefer explicit desired, else +10% of offered
  let suggested = desired || (offered ? Math.round(offered * 1.10) : null);

  // tone-aware templates
  const templates = {
    professional: {
      subject: `Regarding the ${role} offer`,
      opener: `Hi ${company} team,\n\nThank you for the ${role} offer and for the time you've spent with me during the interview process. I’m excited about the opportunity and the team.`,
      body: suggested ? `Based on the responsibilities and market research, I’m targeting ${formatSalary(suggested)}. Would you be open to discussing compensation or benefits to bridge to that range?` : `I’d appreciate the chance to discuss compensation and the full package.`,
      closer: `Thank you for considering — I’m happy to discuss further.\n\nBest regards,\n${name}`
    },
    friendly: {
      subject: `Quick note about the ${role} offer`,
      opener: `Hi ${company} team,\n\nThanks so much for the offer — I’m really excited about the role and the people I met.`,
      body: suggested ? `I’d be hoping for around ${formatSalary(suggested)} given the scope and my experience. Is there room to discuss salary or extra benefits to get closer to that?` : `Would love to chat about the compensation and any other parts of the package.`,
      closer: `Appreciate your time — looking forward to hearing from you.\n\nThanks,\n${name}`
    },
    direct: {
      subject: `Salary discussion for ${role} offer`,
      opener: `Hello ${company} team,\n\nThank you for the offer. I’m interested in moving forward, but want to confirm compensation expectations.`,
      body: suggested ? `I am targeting ${formatSalary(suggested)} based on market data and my experience. Please let me know if that is feasible or what flexibility exists.` : `Please let me know what flexibility exists in the compensation package.`,
      closer: `Regards,\n${name}`
    }
  };

  const t = templates[tone] || templates.professional;
  const email = `${t.subject}\n\n${t.opener}\n\n${t.body}\n\n${t.closer}`;

  const talkingPoints = `Talking points:\n- Thank them and express enthusiasm.\n- State target (${suggested ? formatSalary(suggested) : 'state your target clearly'}).\n- Brief rationale: experience, scope, market data.\n- Ask about flexibility, alternatives (signing bonus, equity, vacation).`;

  negOutput.textContent = email + '\n\n' + talkingPoints;
});

// Negotiation form: additional inputs
const negCurrency = document.createElement('input');
// (we already have inputs in the form, so read them on demand)

// Counter-offer suggestion: guardrails
function suggestCounterOffer(offered, desired){
  if (desired) return desired;
  if (!offered) return null;
  // suggest +5-15% depending on level of difference
  const suggested = Math.round(offered * 1.10);
  const max = Math.round(offered * 1.5);
  return Math.min(suggested, max);
}

// Export top feedback & scripts as .txt
const exportTopBtn = document.getElementById('export-top');
exportTopBtn && exportTopBtn.addEventListener('click', ()=>{
  // gather last feedback and negotiation output
  const role = JSON.parse(localStorage.getItem('current_role')||'null');
  const lastFeedback = Array.from(document.querySelectorAll('#feedback-list li')).map(li=>li.textContent).slice(0,8).join('\n');
  const scripts = negOutput.textContent || '';
  const content = [`Role: ${role?role.title+' ('+role.seniority+')':'—'}`, '', 'Top Feedback:', lastFeedback, '', 'Generated Scripts:', scripts].join('\n\n');
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='offerup_coach_export.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

// Session saving and list
const saveSessionBtn = document.getElementById('save-session');
const viewSessionsBtn = document.getElementById('view-sessions');
const sessionsEl = document.getElementById('sessions');
const sessionListWrap = document.getElementById('session-list');

saveSessionBtn && saveSessionBtn.addEventListener('click', ()=>{
  const role = JSON.parse(localStorage.getItem('current_role')||'null');
  const q = filteredQuestions[currentIndex % filteredQuestions.length] || {text:'-'};
  const feedback = Array.from(document.querySelectorAll('#feedback-list li')).map(li=>li.textContent);
  const score = document.getElementById('rubric-score').textContent;
  const scripts = negOutput.textContent;
  const session = {id:Date.now(), role, question:q.text, answer:answerEl.value, feedback, score, scripts, when: new Date().toISOString()};
  const sessions = JSON.parse(localStorage.getItem('offerup_sessions')||'[]');
  sessions.unshift(session);
  localStorage.setItem('offerup_sessions', JSON.stringify(sessions.slice(0,20)));
  alert('Session saved locally.');
});

viewSessionsBtn && viewSessionsBtn.addEventListener('click', ()=>{
  const sessions = JSON.parse(localStorage.getItem('offerup_sessions')||'[]');
  sessionsEl.innerHTML = '';
  if (!sessions.length){ sessionsEl.innerHTML = '<li>No sessions</li>'; sessionListWrap.hidden=false; return; }
  sessions.forEach(s => { const li=document.createElement('li'); li.textContent = `${new Date(s.when).toLocaleString()} — ${s.role? s.role.title:'—'} — ${s.question}`; sessionsEl.appendChild(li); });
  sessionListWrap.hidden=false;
});

// Role form handlers
const saveRoleBtn = document.getElementById('save-role');
const startPracticeBtn = document.getElementById('start-practice');
saveRoleBtn && saveRoleBtn.addEventListener('click', ()=>{
  const role = {title: document.getElementById('role-title').value.trim(), seniority: document.getElementById('role-seniority').value, industry: document.getElementById('role-industry').value.trim(), location: document.getElementById('role-location').value.trim(), desc: document.getElementById('role-desc').value.trim(), skills: document.getElementById('role-skills').value.split(',').map(s=>s.trim()).filter(Boolean)};
  localStorage.setItem('current_role', JSON.stringify(role));
  alert('Role saved.');
});
startPracticeBtn && startPracticeBtn.addEventListener('click', ()=>{ applyFilters(); document.getElementById('interview-practice').scrollIntoView({behavior:'smooth'}); });

// Word count and timer
const wordCountEl = document.getElementById('word-count');
answerEl.addEventListener('input', ()=>{ wordCountEl.textContent = answerEl.value.trim() ? answerEl.value.trim().split(/\s+/).length : 0; });

let timerInterval = null; let timerSeconds = 0;
const timerDisplay = document.getElementById('timer-display');
document.getElementById('timer-start').addEventListener('click', ()=>{ if (timerInterval) return; timerInterval = setInterval(()=>{ timerSeconds++; const m=Math.floor(timerSeconds/60).toString().padStart(2,'0'); const s=(timerSeconds%60).toString().padStart(2,'0'); timerDisplay.textContent = `${m}:${s}`; },1000); });
document.getElementById('timer-pause').addEventListener('click', ()=>{ clearInterval(timerInterval); timerInterval=null; });

// Record mode placeholder
document.getElementById('record-toggle').addEventListener('click', ()=>{ alert('Record mode placeholder — audio recording not implemented in this MVP.'); });

copyNeg.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(negOutput.textContent);
    copyNeg.textContent = 'Copied!';
    setTimeout(()=> copyNeg.textContent = 'Copy', 1200);
  } catch (e) {
    copyNeg.textContent = 'Copy failed';
    setTimeout(()=> copyNeg.textContent = 'Copy', 1200);
  }
});

// Initialize UI
renderQuestion();

// Expose small helper for debugging
window.OfferUpCoach = {sampleQuestions, analyzeAnswer};
