import { Injectable } from '@nestjs/common';

@Injectable()
export class AnswerFormatterService {
  // Vérifie si les données sont pertinentes pour la question
  checkDataRelevance(question: string, data: any[]): boolean {
    // Simple : si data est vide, ce n'est pas pertinent
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    // On pourrait ajouter ici des règles plus avancées (NLP, mots-clés, etc.)
    return true;
  }

  // Formate une réponse utilisateur à partir des données SQL
  formatAnswer(question: string, data: any[]): string {
    if (!this.checkDataRelevance(question, data)) {
      return "Je n'ai pas trouvé de données pertinentes pour répondre à votre question.";
    }
    // Formatage en tableau markdown (5 premières lignes max)
    const preview = data.slice(0, 5);
    const columns = Object.keys(preview[0]);
    const header = columns.join(' | ');
    const separator = columns.map(() => '---').join(' | ');
    const rows = preview.map(row => columns.map(col => String(row[col])).join(' | '));
    let result = [
      'Voici les résultats trouvés :',
      '```markdown',
      header,
      separator,
      ...rows,
      '```',
    ];
    if (data.length > preview.length) {
      result.push(`... (${data.length} lignes au total)`);
    }
    return result.join('\n');
  }
} 