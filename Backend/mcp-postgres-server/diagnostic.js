#!/usr/bin/env node

// Script de diagnostic complet pour le serveur MCP PostgreSQL
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDiagnostic() {
  console.log('🔍 Diagnostic complet du serveur MCP PostgreSQL\n');
  console.log('=' .repeat(60));

  // 1. Vérification des fichiers
  console.log('\n📁 1. Vérification des fichiers...');
  
  const requiredFiles = [
    'dist/index.js',
    'dist/http-server.js',
    'stdio-wrapper-ebp.js',
    'package.json',
    'tsconfig.json'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? 'existe' : 'MANQUANT'}`);
  }

  // 2. Vérification de la configuration
  console.log('\n⚙️ 2. Vérification de la configuration...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    console.log('✅ package.json valide');
    console.log(`   - Nom: ${packageJson.name}`);
    console.log(`   - Version: ${packageJson.version}`);
    console.log(`   - Type: ${packageJson.type}`);
  } catch (error) {
    console.log('❌ Erreur package.json:', error.message);
  }

  // 3. Vérification des dépendances
  console.log('\n📦 3. Vérification des dépendances...');
  
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules existe');
    
    const requiredDeps = ['@modelcontextprotocol/sdk', 'pg', 'express'];
    for (const dep of requiredDeps) {
      const depPath = path.join(nodeModulesPath, dep);
      const exists = fs.existsSync(depPath);
      console.log(`   ${exists ? '✅' : '❌'} ${dep}`);
    }
  } else {
    console.log('❌ node_modules manquant - exécutez: npm install');
  }

  // 4. Vérification de la configuration MCP
  console.log('\n🔧 4. Vérification de la configuration MCP...');
  
  const cursorConfigPath = path.join(__dirname, '..', '..', '.cursor', 'mcp.json');
  if (fs.existsSync(cursorConfigPath)) {
    try {
      const mcpConfig = JSON.parse(fs.readFileSync(cursorConfigPath, 'utf8'));
      console.log('✅ Configuration MCP trouvée dans .cursor/mcp.json');
      
      const serverConfig = mcpConfig.mcpServers['ebp-postgres'];
      if (serverConfig) {
        console.log('   - Commande:', serverConfig.command);
        console.log('   - Arguments:', serverConfig.args);
        console.log('   - Variables d\'environnement:', Object.keys(serverConfig.env || {}));
      }
    } catch (error) {
      console.log('❌ Erreur configuration MCP:', error.message);
    }
  } else {
    console.log('❌ Configuration MCP manquante dans .cursor/mcp.json');
  }

  // 5. Vérification des chemins
  console.log('\n🛣️ 5. Vérification des chemins...');
  
  const wrapperPath = path.join(__dirname, 'stdio-wrapper-ebp.js');
  const httpServerPath = path.join(__dirname, 'dist', 'http-server.js');
  
  console.log(`Wrapper STDIO: ${wrapperPath}`);
  console.log(`   ${fs.existsSync(wrapperPath) ? '✅' : '❌'} Existe`);
  
  console.log(`Serveur HTTP: ${httpServerPath}`);
  console.log(`   ${fs.existsSync(httpServerPath) ? '✅' : '❌'} Existe`);

  // 6. Vérification des permissions
  console.log('\n🔐 6. Vérification des permissions...');
  
  try {
    fs.accessSync(wrapperPath, fs.constants.R_OK);
    console.log('✅ Wrapper STDIO lisible');
  } catch (error) {
    console.log('❌ Wrapper STDIO non lisible');
  }

  try {
    fs.accessSync(httpServerPath, fs.constants.R_OK);
    console.log('✅ Serveur HTTP lisible');
  } catch (error) {
    console.log('❌ Serveur HTTP non lisible');
  }

  // 7. Recommandations
  console.log('\n💡 7. Recommandations...');
  
  console.log('\n📋 Étapes pour résoudre les problèmes:');
  console.log('1. Compiler le projet: npm run build');
  console.log('2. Installer les dépendances: npm install');
  console.log('3. Démarrer le serveur HTTP: npm run start:http');
  console.log('4. Tester le serveur HTTP: npm run test:http');
  console.log('5. Tester le wrapper STDIO: npm run test:stdio');
  console.log('6. Redémarrer Cursor pour charger la configuration MCP');

  console.log('\n🔧 Commandes de débogage:');
  console.log('- npm run start:http    # Démarrer le serveur HTTP');
  console.log('- npm run test:http     # Tester le serveur HTTP');
  console.log('- npm run test:stdio    # Tester le wrapper STDIO');
  console.log('- node stdio-wrapper-ebp.js  # Tester le wrapper directement');

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Diagnostic terminé');
}

runDiagnostic().catch(console.error); 