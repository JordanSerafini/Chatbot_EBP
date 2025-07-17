// Gestion du thème sombre/clair auto et commutable
const THEME_KEY = 'chatbot_theme';

function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_KEY, theme);
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || getSystemTheme();
}

function toggleTheme() {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function initThemeToggle(btnId) {
  setTheme(getSavedTheme());
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.onclick = toggleTheme;
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) setTheme(e.matches ? 'dark' : 'light');
  });
}

window.themeUtils = { setTheme, getSavedTheme, toggleTheme, initThemeToggle }; 