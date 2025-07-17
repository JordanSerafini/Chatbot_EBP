// robot.js - Gère le clic sur le robot pour ouvrir le chat
const robotDiv = document.getElementById('robot');
robotDiv.addEventListener('click', () => {
  window.electronAPI?.openChat();
}); 