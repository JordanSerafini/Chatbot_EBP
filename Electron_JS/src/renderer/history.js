// Module d'historique de conversation (localStorage)
const HISTORY_KEY = 'chatbot_history';

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function addMessageToHistory(msg) {
  const history = loadHistory();
  history.push(msg);
  saveHistory(history);
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

window.historyUtils = { saveHistory, loadHistory, addMessageToHistory, clearHistory }; 