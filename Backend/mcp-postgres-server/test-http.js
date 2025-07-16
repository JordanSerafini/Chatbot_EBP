#!/usr/bin/env node

// Script de test pour le serveur HTTP MCP
const baseUrl = 'http://localhost:3000';

async function testHttpServer() {
  console.log('🧪 Test du serveur HTTP MCP...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Test du health check...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Liste des outils
    console.log('\n2️⃣ Test de la liste des outils...');
    const toolsResponse = await fetch(`${baseUrl}/api/tools`);
    const toolsData = await toolsResponse.json();
    console.log('✅ Outils disponibles:', toolsData);

    // Test 3: Statut de la base de données
    console.log('\n3️⃣ Test du statut de la base de données...');
    const statusResponse = await fetch(`${baseUrl}/api/status`);
    const statusData = await statusResponse.json();
    console.log('✅ Statut DB:', statusData);

    // Test 4: Liste des tables
    console.log('\n4️⃣ Test de la liste des tables...');
    const tablesResponse = await fetch(`${baseUrl}/api/tables`);
    const tablesData = await tablesResponse.json();
    console.log('✅ Tables:', tablesData);

    console.log('\n🎉 Tous les tests HTTP sont passés avec succès!');
    console.log('📋 Le serveur HTTP MCP est prêt à être utilisé.');

  } catch (error) {
    console.error('❌ Erreur lors du test HTTP:', error.message);
    console.log('\n🔧 Vérifications à faire:');
    console.log('1. Le serveur HTTP est-il démarré? (npm run start:http)');
    console.log('2. Le port 3000 est-il disponible?');
    console.log('3. La base de données PostgreSQL est-elle accessible?');
  }
}

testHttpServer(); 