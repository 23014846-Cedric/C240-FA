// OfferUp Coach - starter interactivity
// - Provides question switching, answer feedback, localStorage save
// - Generates simple negotiation scripts

const sampleQuestions = [
  "Tell me about a time you disagreed with a teammate. How did you handle it?",
  "Walk me through a project you led from concept to delivery.",
  "How do you prioritize tasks when everything feels urgent?",
  "Why are you interested in this role at our company?",
  "Describe a time you used data to make a decision — what was the outcome?",
  "Tell me about a challenge you faced and how you resolved it.",
  "How do you handle feedback and change your approach?",
  "Give an example of when you had to learn a new skill quickly."
];

let currentIndex = 0;

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

function renderQuestion() {
  qText.textContent = sampleQuestions[currentIndex];
  const saved = localStorage.getItem(`answer_${currentIndex}`);
  answerEl.value = saved || '';
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + sampleQuestions.length) % sampleQuestions.length;
  renderQuestion();
});
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % sampleQuestions.length;
  renderQuestion();
});

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

submitBtn.addEventListener('click', () => {
  const text = answerEl.value || '';
  const tips = analyzeAnswer(text);
  feedbackList.innerHTML = '';
  tips.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    feedbackList.appendChild(li);
  });
});

saveBtn.addEventListener('click', () => {
  localStorage.setItem(`answer_${currentIndex}`, answerEl.value || '');
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
  const salary = document.getElementById('neg-salary').value.trim() || 'the offered salary';

  const email = `Hi ${company} team,\n\nThank you again for the ${role} offer. I’m excited about the opportunity and the team. Based on my research and the responsibilities of the role, I’m seeking ${salary} to reflect the scope and my experience. Is there flexibility to discuss compensation or additional benefits?\n\nI’d appreciate the chance to discuss this further — thank you for considering.\n\nBest,\n${name}`;

  const talkingPoints = `Key talking points:\n- Express gratitude and enthusiasm.\n- State target compensation clearly: ${salary}.\n- Highlight brief reasons (experience, scope, market data).\n- Ask about flexibility and other benefits.`;

  negOutput.textContent = email + '\n\n' + talkingPoints;
});

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
