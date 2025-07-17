import { Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify/sync';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

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

  // Ajoute un résumé métier en début de réponse et propose export si volumineux
  formatAnswer(question: string, data: any[]): string {
    if (!this.checkDataRelevance(question, data)) {
      return "Je n'ai pas trouvé de données pertinentes pour répondre à votre question.";
    }
    
    const lowerQ = question.toLowerCase();
    let type = 'liste';
    if (/moyenne|médiane|total|somme|sum|count|nombre|statistique|moyen|maximum|minim|écart|répartition/.test(lowerQ)) {
      type = 'statistique';
    } else if (/recherche|trouve|trouver|quel|quelle|qui|où|whose|find|search/.test(lowerQ)) {
      type = 'recherche';
    }
    
    const preview = data.slice(0, 5);
    const columns = Object.keys(preview[0]);
    
    // Résumé métier
    let summary = `**Résumé métier :**\n- Résultat : ${data.length} ligne(s), ${columns.length} colonne(s).`;
    if (data.length > 50) {
      summary += '\n- Résultat volumineux : export CSV ou graphique conseillé.';
    }
    summary += '\n- Conseil : Filtrez, triez ou demandez une statistique pour affiner.';
    
    // Exemples si question floue
    if (lowerQ.length < 10 || /quoi|comment|aide|exemple|help|\?\s*$/.test(lowerQ)) {
      summary += '\n- Exemple : "Montre-moi les 10 dernières ventes", "Quel est le total des factures par client ?"';
    }
    
    // Tableau markdown
    const header = columns.join(' | ');
    const separator = columns.map(() => '---').join(' | ');
    const rows = preview.map(row => 
      columns.map(col => String(row[col])).join(' | ')
    );
    const table = ['```markdown', header, separator, ...rows, '```'].join('\n');
    
    // Propose export CSV si volumineux
    let exportMsg = '';
    if (data.length > 50) {
      exportMsg = '\n[Export CSV disponible]\n';
    }
    
    // (Bonus) Propose un graphique si pertinent (ex: 2 colonnes numériques)
    let chartMsg = '';
    if (data.length > 50 && columns.length === 2 && 
        data.every(row => typeof row[columns[0]] === 'number' && typeof row[columns[1]] === 'number')) {
      chartMsg = '\n[Graphique disponible]\n';
    }
    
    return [summary, exportMsg, chartMsg, table].filter(Boolean).join('\n');
  }

  // (Bonus) Export CSV
  exportCsv(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) return '';
    return stringify(data, { header: true });
  }

  // (Bonus) Génère un graphique simple (bar chart)
  async generateChart(data: any[], columns: string[]): Promise<Buffer> {
    const width = 800, height = 400;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    
    const config = {
      type: 'bar' as const,
      data: {
        labels: data.map(row => row[columns[0]]),
        datasets: [{
          label: columns[1],
          data: data.map(row => row[columns[1]]),
        }],
      },
    };
    
    return chartJSNodeCanvas.renderToBuffer(config);
  }
} 