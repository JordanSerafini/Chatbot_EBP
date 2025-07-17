import { Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify/sync';

export interface FormattedResponse {
  type: 'liste' | 'detail' | 'statistique' | 'recherche' | 'erreur';
  message: string;
  data?: any[];
  metadata?: {
    rowCount: number;
    columnCount: number;
    preview?: any[];
  };
}

@Injectable()
export class AnswerFormatterService {
  // Vérifie si les données sont pertinentes pour la question
  checkDataRelevance(question: string, data: any[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    return true;
  }

  // Détecte le type de réponse basé sur la question et les données
  detectResponseType(
    question: string,
    data: any[],
  ): 'liste' | 'detail' | 'statistique' | 'recherche' {
    const lowerQ = question.toLowerCase();

    // Statistiques et agrégations
    if (
      /moyenne|médiane|total|somme|sum|count|nombre|statistique|moyen|maximum|minim|écart|répartition|cumulé/.test(
        lowerQ,
      )
    ) {
      return 'statistique';
    }

    // Recherches spécifiques
    if (
      /recherche|trouve|trouver|quel|quelle|qui|où|whose|find|search|montre-moi|donne-moi/.test(
        lowerQ,
      )
    ) {
      return 'recherche';
    }

    // Détail d'un élément spécifique
    if (
      data.length === 1 ||
      /détail|fiche|information sur|données de/.test(lowerQ)
    ) {
      return 'detail';
    }

    // Par défaut : liste
    return 'liste';
  }

  // Formate une réponse selon son type
  formatAnswer(question: string, data: any[]): FormattedResponse {
    if (!this.checkDataRelevance(question, data)) {
      return {
        type: 'erreur',
        message:
          "Je n'ai pas trouvé de données pertinentes pour répondre à votre question.",
      };
    }

    const responseType = this.detectResponseType(question, data);
    const columns = Object.keys(data[0] || {});

    switch (responseType) {
      case 'statistique':
        return this.formatStatistique(question, data, columns);
      case 'detail':
        return this.formatDetail(question, data, columns);
      case 'recherche':
        return this.formatRecherche(question, data, columns);
      case 'liste':
      default:
        return this.formatListe(question, data, columns);
    }
  }

  // Formate une réponse de type statistique
  private formatStatistique(
    question: string,
    data: any[],
    columns: string[],
  ): FormattedResponse {
    const firstRow = data[0] as Record<string, unknown>;
    const values = Object.values(firstRow);

    // Si c'est une seule valeur (ex: total, moyenne)
    if (data.length === 1 && columns.length === 1) {
      const value = values[0];
      const columnName = columns[0];

      // Formater selon le type de valeur
      let formattedValue = value;
      if (typeof value === 'number') {
        formattedValue = new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      }

      return {
        type: 'statistique',
        message: `Le ${columnName} est de ${String(formattedValue)}.`,
        data,
        metadata: {
          rowCount: data.length,
          columnCount: columns.length,
        },
      };
    }

    // Si c'est un tableau de statistiques
    const preview = data.slice(0, 3);
    const message = `Voici les statistiques demandées (${data.length} résultat${
      data.length > 1 ? 's' : ''
    }) :`;

    return {
      type: 'statistique',
      message,
      data,
      metadata: {
        rowCount: data.length,
        columnCount: columns.length,
        preview,
      },
    };
  }

  // Formate une réponse de type détail
  private formatDetail(
    question: string,
    data: any[],
    columns: string[],
  ): FormattedResponse {
    const item = data[0] as Record<string, unknown>;
    const details = columns
      .map((col) => `${col}: ${String(item[col])}`)
      .join(', ');

    return {
      type: 'detail',
      message: `Voici les détails : ${details}`,
      data,
      metadata: {
        rowCount: data.length,
        columnCount: columns.length,
      },
    };
  }

  // Formate une réponse de type recherche
  private formatRecherche(
    question: string,
    data: any[],
    columns: string[],
  ): FormattedResponse {
    const count = data.length;
    let message = '';

    if (count === 0) {
      message = 'Aucun résultat trouvé pour votre recherche.';
    } else if (count === 1) {
      message = "J'ai trouvé 1 résultat :";
    } else if (count <= 10) {
      message = `J'ai trouvé ${count} résultats :`;
    } else {
      message = `J'ai trouvé ${count} résultats (affichage des 10 premiers) :`;
    }

    const preview = data.slice(0, 10);

    return {
      type: 'recherche',
      message,
      data,
      metadata: {
        rowCount: data.length,
        columnCount: columns.length,
        preview,
      },
    };
  }

  // Formate une réponse de type liste
  private formatListe(
    question: string,
    data: any[],
    columns: string[],
  ): FormattedResponse {
    const count = data.length;
    let message = '';

    if (count === 0) {
      message = 'La liste est vide.';
    } else if (count === 1) {
      message = "Voici l'élément demandé :";
    } else if (count <= 20) {
      message = `Voici la liste (${count} élément${count > 1 ? 's' : ''}) :`;
    } else {
      message = `Voici la liste (${count} éléments, affichage des 20 premiers) :`;
    }

    const preview = data.slice(0, 20);

    return {
      type: 'liste',
      message,
      data,
      metadata: {
        rowCount: data.length,
        columnCount: columns.length,
        preview,
      },
    };
  }

  // Export CSV
  exportCsv(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) return '';
    return stringify(data, { header: true });
  }

  // Génère des données pour un graphique (format JSON pour utilisation externe)
  generateChartData(data: any[], columns: string[]): any {
    if (
      !Array.isArray(data) ||
      data.length === 0 ||
      !columns ||
      columns.length < 2
    ) {
      return null;
    }

    return {
      type: 'bar',
      data: {
        labels: data.map((row) => row[columns[0]]),
        datasets: [
          {
            label: columns[1],
            data: data.map((row) => row[columns[1]]),
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  }
}
