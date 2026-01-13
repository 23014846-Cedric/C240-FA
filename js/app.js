// OfferUp Coach - starter interactivity
// - Provides question switching, answer feedback, localStorage save
// - Generates simple negotiation scripts

const sampleQuestions = [
  "Tell me about a time you disagreed with a teammate. How did you handle it?",
  "Walk me through a project you led from concept to delivery.",
  "How do you prioritize tasks when everything feels urgent?",
  "Why are you interested in this role at our company?"
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
  if (len < 50) tips.push('Answer is short — add specific details or metrics.');
  if (!text.match(/\b(I|we)\b/i)) tips.push('Consider using first-person language to show ownership.');
  if (text.match(/\b(um|uh|like|you know)\b/i)) tips.push('Reduce filler words (um, uh, like). Practice pausing.');
  if (!text.match(/\b(result|impact|outcome|deliverable)\b/i)) tips.push('Try to state the result / impact (quantify when possible).');
  tips.push('Structure answers using STAR: Situation, Task, Action, Result.');
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
