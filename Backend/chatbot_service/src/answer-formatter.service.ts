import { Injectable } from '@nestjs/common';

export interface FormattedAnswer {
  summary: string;
  tables: { name: string; description?: string }[];
  markdownTable: string;
  suggestions?: string[];
  exportLink?: string;
  chartSuggestion?: string;
  details?: any;
}

@Injectable()
export class AnswerFormatterService {
  /**
   * Formate la réponse complète selon le format attendu (résumé, tables, tableau, suggestions...)
   */
  format(
    summary: string,
    tables: { name: string; description?: string }[],
    markdownTable: string,
    suggestions?: string[],
    exportLink?: string,
    chartSuggestion?: string,
    details?: any,
  ): FormattedAnswer {
    return {
      summary,
      tables,
      markdownTable,
      suggestions,
      exportLink,
      chartSuggestion,
      details,
    };
  }
}
