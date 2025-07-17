// Module d'export d'historique (JSON/CSV)
function exportHistoryJSON(history) {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, 'chatbot_history.json');
}

function exportHistoryCSV(history) {
  if (!history.length) return;
  const keys = Object.keys(history[0]);
  const csv = [keys.join(',')].concat(history.map(row => keys.map(k => '"' + String(row[k]).replace(/"/g, '""') + '"').join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, 'chatbot_history.csv');
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

window.exportUtils = { exportHistoryJSON, exportHistoryCSV }; 