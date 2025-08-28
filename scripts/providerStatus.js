// Prints provider status without exposing secrets
// Windows/cmd-friendly output

function bool(v) {
  return v && typeof v === 'string' ? v.trim().length > 0 : Boolean(v);
}

const status = {
  provider: 'gemini',
  keyPresent: bool(process.env.GOOGLE_API_KEY),
  model: process.env.GEMINI_MODEL || 'default',
  thinkingBudget: process.env.GEMINI_THINKING_BUDGET || 'unset'
};

const ok = status.keyPresent;

console.log(`provider: ${status.provider}`);
console.log(`keyPresent: ${ok ? 'yes' : 'no'}`);
console.log(`model: ${status.model}`);
console.log(`thinkingBudget: ${status.thinkingBudget}`);

process.exit(0);
