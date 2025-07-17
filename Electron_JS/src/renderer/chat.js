// chat.js - Logique principale du chat EBP

// --- Sélecteurs DOM ---
const chat = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const statusDot = document.getElementById('status-dot');
const examplesZone = document.getElementById('examples');
const exportBtn = document.getElementById('export-btn');

// --- Exemples de questions (personnalisables) ---
const EXAMPLES = [
  "Montre-moi le chiffre d'affaires du mois dernier",
  "Liste les 10 derniers clients",
  "Statistiques des ventes par produit",
  "Quels sont les fournisseurs principaux ?",
  "Export des mouvements de caisse"
];

// --- Loader animé ---
function showLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.id = 'bot-loader';
  loader.innerHTML = '<span>Le bot réfléchit…</span>' +
    '<span class="loader-dot"></span><span class="loader-dot"></span><span class="loader-dot"></span>';
  chat.appendChild(loader);
  chat.scrollTop = chat.scrollHeight;
}
function hideLoader() {
  const loader = document.getElementById('bot-loader');
  if (loader) loader.remove();
}

// --- Statut de connexion backend ---
function setStatus(color, title) {
  statusDot.style.background = color;
  statusDot.title = title;
}
async function checkStatus() {
  setStatus('#FFA500', 'Vérification…');
  try {
    const res = await fetch('../main/config.json');
    const { apiBaseUrl } = await res.json();
    const ping = await fetch(apiBaseUrl, { method: 'GET' });
    if (ping.ok) setStatus('#4CAF50', 'Connecté au chatbot');
    else setStatus('#FF9800', 'Réponse inattendue du chatbot');
  } catch {
    setStatus('#F44336', 'Erreur de connexion au chatbot');
  }
}

// --- Création dynamique des bulles ---
function createDataTable(data, columns) {
  const table = document.createElement('table');
  table.className = 'data-table';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = row[col] !== null && row[col] !== undefined ? String(row[col]) : '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function createFormattedBubble(response, formattedResponse) {
  const bubble = document.createElement('div');
  let bubbleClass = 'bubble';
  if (formattedResponse && formattedResponse.type) {
    bubbleClass += ` ${formattedResponse.type}`;
  }
  bubble.className = bubbleClass;
  // Message principal
  const messageDiv = document.createElement('div');
  messageDiv.textContent = response.answer || 'Erreur : pas de réponse du bot';
  bubble.appendChild(messageDiv);
  // Bouton copier (réponse bot)
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'Copier';
  copyBtn.onclick = () => {
    window.electronAPI?.copyToClipboard(messageDiv.textContent);
    showNotification('Réponse copiée !');
  };
  bubble.appendChild(copyBtn);
  // Tableaux structurés
  if (formattedResponse && formattedResponse.data && formattedResponse.data.length > 0) {
    const columns = Object.keys(formattedResponse.data[0]);
    const preview = formattedResponse.preview || formattedResponse.data.slice(0, 10);
    if (preview.length > 0) {
      const table = createDataTable(preview, columns);
      // Bouton copier pour le tableau
      const tableCopyBtn = document.createElement('button');
      tableCopyBtn.className = 'copy-btn';
      tableCopyBtn.textContent = 'Copier';
      tableCopyBtn.onclick = () => {
        let csv = columns.join(',') + '\n';
        csv += preview.map(row => columns.map(col => '"' + String(row[col]).replace(/"/g, '""') + '"').join(',')).join('\n');
        window.electronAPI?.copyToClipboard(csv);
        showNotification('Tableau copié !');
      };
      table.style.position = 'relative';
      table.appendChild(tableCopyBtn);
      bubble.appendChild(table);
    }
    // Métadonnées
    if (formattedResponse.metadata) {
      const metadataDiv = document.createElement('div');
      metadataDiv.className = 'metadata';
      const { rowCount, columnCount } = formattedResponse.metadata;
      metadataDiv.textContent = `${rowCount} ligne(s), ${columnCount} colonne(s)`;
      if (rowCount > preview.length) {
        metadataDiv.textContent += ` (affichage des ${preview.length} premiers)`;
      }
      bubble.appendChild(metadataDiv);
    }
  }
  return bubble;
}

// --- Notification système si fenêtre non focus ---
function showNotification(msg) {
  if (!document.hasFocus() && window.electronAPI?.notify) {
    window.electronAPI.notify('Chatbot EBP', msg);
  }
}

// --- Affichage de l'historique au chargement ---
function renderHistory() {
  chat.innerHTML = '';
  const history = window.historyUtils.loadHistory();
  history.forEach(msg => {
    if (msg.role === 'user') {
      const userBubble = document.createElement('div');
      userBubble.className = 'bubble user';
      userBubble.textContent = msg.text;
      chat.appendChild(userBubble);
    } else {
      const botBubble = createFormattedBubble(msg.response, msg.formattedResponse);
      chat.appendChild(botBubble);
    }
  });
  chat.scrollTop = chat.scrollHeight;
}

// --- Zone d'exemples cliquables ---
function renderExamples() {
  examplesZone.innerHTML = '';
  EXAMPLES.forEach(ex => {
    const btn = document.createElement('button');
    btn.className = 'example-btn';
    btn.textContent = ex;
    btn.onclick = () => {
      input.value = ex;
      input.focus();
    };
    examplesZone.appendChild(btn);
  });
}

// --- Gestion multi-ligne (Shift+Entrée) ---
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

// --- Drag & Drop de fichier (CSV, Excel) ---
chat.addEventListener('dragover', e => {
  e.preventDefault();
  chat.classList.add('dragover');
});
chat.addEventListener('dragleave', e => {
  e.preventDefault();
  chat.classList.remove('dragover');
});
chat.addEventListener('drop', e => {
  e.preventDefault();
  chat.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && (file.type.includes('csv') || file.name.endsWith('.csv') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      input.value = `Analyse ce fichier :\n${evt.target.result.substring(0, 1000)}...`;
      input.focus();
    };
    reader.readAsText(file);
  } else {
    showNotification('Format non supporté.');
  }
});

// --- Soumission du formulaire (envoi message) ---
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  // Ajout à l'historique local
  window.historyUtils.addMessageToHistory({ role: 'user', text });
  const userBubble = document.createElement('div');
  userBubble.className = 'bubble user';
  userBubble.textContent = text;
  chat.appendChild(userBubble);
  input.value = '';
  chat.scrollTop = chat.scrollHeight;
  showLoader();
  // Appel API backend
  try {
    const resConf = await fetch('../main/config.json');
    const { apiBaseUrl } = await resConf.json();
    const response = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text })
    });
    hideLoader();
    if (!response.ok) throw new Error('Erreur API');
    const data = await response.json();
    // Ajout à l'historique local
    window.historyUtils.addMessageToHistory({ role: 'bot', response: data, formattedResponse: data.formattedResponse });
    const botBubble = createFormattedBubble(data, data.formattedResponse);
    chat.appendChild(botBubble);
    chat.scrollTop = chat.scrollHeight;
    showNotification('Nouvelle réponse du bot !');
    checkStatus();
  } catch (err) {
    hideLoader();
    const botBubble = document.createElement('div');
    botBubble.className = 'bubble';
    botBubble.textContent = err.message || 'Erreur de connexion au chatbot';
    chat.appendChild(botBubble);
    chat.scrollTop = chat.scrollHeight;
    setStatus('#F44336', 'Erreur de connexion au chatbot');
  }
});

// --- Export de l'historique (JSON/CSV) ---
exportBtn.onclick = () => {
  const history = window.historyUtils.loadHistory();
  if (!history.length) return alert('Aucun historique à exporter.');
  if (confirm('Exporter en JSON ? (Annuler = CSV)')) {
    window.exportUtils.exportHistoryJSON(history);
  } else {
    window.exportUtils.exportHistoryCSV(history);
  }
};

// --- Initialisation du thème ---
window.themeUtils.initThemeToggle('theme-toggle');

// --- Initialisation au chargement ---
window.addEventListener('DOMContentLoaded', () => {
  renderExamples();
  renderHistory();
  checkStatus();
});

// --- Sauvegarde de l'historique à chaque modification ---
window.addEventListener('beforeunload', () => {
  // L'historique est déjà sauvegardé à chaque ajout
}); 