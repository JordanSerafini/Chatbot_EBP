#!/usr/bin/env node

// Script de test pour le wrapper STDIO MCP
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStdioWrapper() {
  console.log('🧪 Test du wrapper STDIO MCP...\n');

  const wrapperPath = path.join(__dirname, 'stdio-wrapper-ebp.js');
  
  console.log(`📂 Chemin du wrapper: ${wrapperPath}`);

  const child = spawn('node', [wrapperPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      HTTP_BASE_URL: 'http://localhost:3000',
      MCP_SERVER_NAME: 'ebp-postgres-sync',
      MCP_SERVER_VERSION: '1.0.0',
      NODE_ENV: 'development'
    }
  });

  let stdoutData = '';
  let stderrData = '';

  child.stdout.on('data', (data) => {
    stdoutData += data.toString();
    console.log('📤 STDOUT:', data.toString());
  });

  child.stderr.on('data', (data) => {
    stderrData += data.toString();
    console.log('📤 STDERR:', data.toString());
  });

  child.on('error', (error) => {
    console.error('❌ Erreur du processus:', error);
  });

  child.on('exit', (code) => {
    console.log(`\n🏁 Processus terminé avec le code: ${code}`);
    console.log('📋 Données STDOUT:', stdoutData);
    console.log('📋 Données STDERR:', stderrData);
  });

  // Envoyer une requête de test après un délai
  setTimeout(() => {
    const testRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };

    console.log('📤 Envoi de la requête de test:', JSON.stringify(testRequest));
    child.stdin.write(JSON.stringify(testRequest) + '\n');
  }, 2000);

  // Arrêter le test après 10 secondes
  setTimeout(() => {
    console.log('⏰ Arrêt du test après 10 secondes...');
    child.kill();
  }, 10000);
}

testStdioWrapper().catch(console.error); 