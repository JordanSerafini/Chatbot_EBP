// api-service.js - Gère les appels à l\'API backend
const configPath = '../main/config.json';

async function getApiBaseUrl() {
  try {
    const res = await fetch(configPath);
    if (!res.ok) throw new Error(`Erreur de chargement de la configuration: ${res.statusText}`);
    const { apiBaseUrl } = await res.json();
    return apiBaseUrl;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URL de l\'API:', error);
    throw new Error('Impossible de charger l\'URL de l\'API.');
  }
}

async function sendMessageToBot(question) {
  try {
    const apiBaseUrl = await getApiBaseUrl();
    const response = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message au bot:', error);
    throw error;
  }
}

async function checkApiStatus() {
  try {
    const apiBaseUrl = await getApiBaseUrl();
    const ping = await fetch(apiBaseUrl, { method: 'GET' });
    return ping.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut de l\'API:', error);
    return false;
  }
}

module.exports = { sendMessageToBot, checkApiStatus, getApiBaseUrl }; 