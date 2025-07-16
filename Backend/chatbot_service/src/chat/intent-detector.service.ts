import { Injectable } from '@nestjs/common';

@Injectable()
export class IntentDetectorService {
  detectIntent(question: string): 'sql' | 'document' | 'business' | 'unknown' {
    if (/facture|devis|commande|document/i.test(question)) return 'document';
    if (/select|from|where|sql/i.test(question)) return 'sql';
    // Ajoute d'autres règles métier ici
    return 'unknown';
  }
}
