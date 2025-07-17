// robot.js - Gère le clic sur le robot pour ouvrir le chat
const robotDiv = document.getElementById('robot');
robotDiv.addEventListener('click', () => {
  if (window.electronAPI && window.electronAPI.openChat) {
    window.electronAPI.openChat();
  } else {
    alert('API Electron non disponible');
  }
}); 