module.exports = {
  types: [
    { value: 'feat ✨', name: 'feat: ✨ added a new feature.' },
    { value: 'fix 🐛', name: 'fix: 🐛 added a bug fix.' },
    { value: 'styles 🎨', name: 'styles: 🎨 edited some UI styles or other general styling config.' },
    { value: 'refactor ♻️', name: 'refactor: ♻️ refactored code that does not affect feature.' },
    { value: 'perf ⚡', name: 'perf: ⚡ made a performance improvement.' },
    { value: 'test ✅', name: 'test: ✅ added tests.' },
    { value: 'deps 📦', name: 'deps: 📦 added or bumped dependencies.' },
    { value: 'chore 🧰', name: 'chore: 🧰 changed project configuration.' }
  ],
  messages: {
    type: 'Select the type of change you are committing',
    subject: 'Body.',
    confirmCommit: 'Do you want to proceed with the commit above?'
  },
  skipQuestions: ['scope', 'body', 'breaking', 'footer'],
  subjectLimit: 100,
  subjectSeparator: ' : '
};
