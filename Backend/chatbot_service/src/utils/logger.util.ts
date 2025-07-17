/**
 * Logger structuré pour l'audit et le debug du chatbot
 */
import { appendFileSync } from 'fs';
import { join } from 'path';

const LOG_PATH = join(__dirname, '../../logs/chatbot.log');

export function logEvent(event: string, data: any) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [${event}] ${JSON.stringify(data, null, 2)}\n`;
  appendFileSync(LOG_PATH, entry, { encoding: 'utf-8' });
}

export function logPrompt(prompt: string, context?: any) {
  logEvent('PROMPT', { prompt, context });
}

export function logSQL(query: string, context?: any) {
  logEvent('SQL', { query, context });
}

export function logAnalysis(analysis: any, context?: any) {
  logEvent('ANALYSIS', { analysis, context });
}

export function logResponse(response: any, context?: any) {
  logEvent('RESPONSE', { response, context });
} 