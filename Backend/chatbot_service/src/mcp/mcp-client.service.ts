import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MCPClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('MCP_SERVER_URL');
    if (!url) {
      throw new Error('MCP_SERVER_URL manquant dans la configuration');
    }
    this.baseUrl = url;
  }

  async executeQuery(query: string, limit = 100): Promise<any> {
    console.log('[MCP] SQL envoyé à MCP :', query);

    // Validation : LIMIT doit être suivi d'un nombre
    const limitRegex = /LIMIT\s*;?$/i;
    if (limitRegex.test(query)) {
      throw new Error('Requête SQL incomplète : LIMIT sans nombre');
    }

    // Correction automatique : si pas de LIMIT, on l'ajoute
    if (!/LIMIT\s+\d+/i.test(query)) {
      // Ajoute LIMIT à la fin si absent
      if (query.trim().endsWith(';')) {
        query = query.trim().replace(/;$/, ` LIMIT ${limit};`);
      } else {
        query = `${query.trim()} LIMIT ${limit};`;
      }
      console.log('[MCP] SQL corrigé avec LIMIT :', query);
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/api/query`, { query, limit }),
      );
      
      if (Array.isArray(response.data)) {
        console.log(
          '[MCP] Résultat executeQuery: lignes retournées =',
          response.data.length,
        );
      } else {
        const preview = JSON.stringify(response.data);
        console.log(
          '[MCP] Résultat executeQuery (extrait) :',
          preview.slice(0, 300),
          '...',
        );
      }
      return response.data;
    } catch (error: any) {
      console.error('[MCP] Erreur executeQuery:', error.message);
      // Retourner une erreur plus informative mais ne pas faire échouer le processus
      return {
        error: true,
        message: `Erreur lors de l'exécution de la requête: ${error.message}`,
        details: error.response?.data || 'Pas de détails disponibles'
      };
    }
  }

  async listTables(schema = 'public'): Promise<any> {
    console.log('[MCP] Appel listTables:', schema);
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/api/tables`, {
          params: { schema },
        }),
      );
      if (Array.isArray(response.data)) {
        console.log(
          '[MCP] Résultat listTables: lignes retournées =',
          response.data.length,
        );
      } else {
        const preview = JSON.stringify(response.data);
        console.log(
          '[MCP] Résultat listTables (extrait) :',
          preview.slice(0, 300),
          '...',
        );
      }
      return response.data;
    } catch (error: any) {
      console.error('[MCP] Erreur listTables:', error.message);
      // Retourner une liste vide en cas d'erreur plutôt que de faire échouer
      return {
        error: true,
        message: `Erreur lors de la récupération des tables: ${error.message}`,
        data: []
      };
    }
  }

  async describeTable(tableName: string, schema = 'public'): Promise<any> {
    console.log('[MCP] Appel describeTable:', tableName, 'schema:', schema);
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/api/tables/${tableName}`, {
          params: { schema },
        }),
      );
      const preview = JSON.stringify(response.data);
      console.log(
        '[MCP] Résultat describeTable (extrait) :',
        preview.slice(0, 300),
        '...',
      );
      return response.data;
    } catch (error: any) {
      console.error('[MCP] Erreur describeTable pour', tableName, ':', error.message);
      // Retourner une structure vide plutôt que de faire échouer
      return {
        error: true,
        message: `Impossible de décrire la table ${tableName}: ${error.message}`,
        data: []
      };
    }
  }

  async analyzeTable(tableName: string, columns?: string[]): Promise<any> {
    console.log('[MCP] Appel analyzeTable:', tableName, 'columns:', columns);
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/api/analyze/${tableName}`, {
          columns,
        }),
      );
      const preview = JSON.stringify(response.data);
      console.log(
        '[MCP] Résultat analyzeTable (extrait) :',
        preview.slice(0, 300),
        '...',
      );
      return response.data;
    } catch (error: any) {
      console.error('[MCP] Erreur analyzeTable:', error.message);
      return {
        error: true,
        message: `Erreur lors de l'analyse de la table ${tableName}: ${error.message}`,
        data: []
      };
    }
  }

  async getSchema(): Promise<any> {
    console.log('[MCP] Appel getSchema');
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/api/schema`),
      );
      const preview = JSON.stringify(response.data);
      console.log(
        '[MCP] Résultat getSchema (extrait) :',
        preview.slice(0, 300),
        '...',
      );
      return response.data;
    } catch (error: any) {
      console.error('[MCP] Erreur getSchema:', error.message);
      return {
        error: true,
        message: `Erreur lors de la récupération du schéma: ${error.message}`,
        database: 'ebp_dump',
        tables: []
      };
    }
  }
}
