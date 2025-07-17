import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { injectVariables } from './utils/prompt-inject.util';
import { sanitizeUserInput } from './utils/sanitize-input.util';

export interface ChartData {
  [key: string]: string | number | Date;
}

@Injectable()
export class PromptService {
  private promptDir = join(__dirname, 'prompts');

  /**
   * Charge un template markdown et injecte les variables dynamiquement
   */
  private loadPromptTemplate(
    filename: string,
    variables: Record<string, any> = {},
  ): string {
    const path = join(this.promptDir, filename);
    const template = readFileSync(path, 'utf-8');
    return injectVariables(template, variables);
  }

  /**
   * Sanitize une entrée utilisateur (anti-injection SQL/prompt)
   */
  sanitizeInput(input: string): { sanitized: string; flagged: boolean } {
    return sanitizeUserInput(input);
  }

  /**
   * Génère le prompt système principal pour OpenAI
   */
  getSystemPrompt(): string {
    return this.loadPromptTemplate('system.md');
  }

  /**
   * Génère des instructions spécifiques pour clarifier une question floue
   */
  getClarificationPrompt(question: string): string {
    return this.loadPromptTemplate('clarification.md', { question });
  }

  /**
   * Génère un prompt pour l'analyse de données
   */
  getAnalysisPrompt(tableName: string, columns?: string[]): string {
    const columnList = columns?.length ? `colonnes ${columns.join(', ')}` : 'toutes les colonnes';
    return this.loadPromptTemplate('analysis.md', { tableName, columnList });
  }

  /**
   * Génère des instructions pour la génération de graphiques
   */
  getChartPrompt(data: ChartData[], columns: string[]): string {
    return this.loadPromptTemplate('chart.md', {
      rowCount: data.length,
      columnCount: columns.length,
    });
  }

  /**
   * Génère un prompt pour l'export CSV
   */
  getExportPrompt(data: any[], question: string): string {
    return this.loadPromptTemplate('export.md', {
      rowCount: data.length,
      question,
    });
  }

  /**
   * Génère des instructions pour la pagination
   */
  getPaginationPrompt(page: number, limit: number): string {
    return this.loadPromptTemplate('pagination.md', {
      page,
      limit,
      offset: (page - 1) * limit,
    });
  }
}
