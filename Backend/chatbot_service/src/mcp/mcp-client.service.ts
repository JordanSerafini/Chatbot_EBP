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
    // Validation simple : LIMIT doit être suivi d'un nombre
    if (/LIMIT\s*;?$/i.test(query)) {
      throw new Error('Requête SQL incomplète : LIMIT sans nombre');
    }
    // On pourrait ajouter d'autres validations ici
    const response = await lastValueFrom(
      this.httpService.post(`${this.baseUrl}/api/query`, { query, limit }),
    );
    console.log('[MCP] Résultat executeQuery:', response.data);
    return response.data;
  }

  async listTables(schema = 'public'): Promise<any> {
    console.log('[MCP] Appel listTables:', schema);
    const response = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/api/tables`, {
        params: { schema },
      }),
    );
    console.log('[MCP] Résultat listTables:', response.data);
    return response.data;
  }

  async describeTable(tableName: string, schema = 'public'): Promise<any> {
    console.log('[MCP] Appel describeTable:', tableName, 'schema:', schema);
    const response = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/api/tables/${tableName}`, {
        params: { schema },
      }),
    );
    console.log('[MCP] Résultat describeTable:', response.data);
    return response.data;
  }

  async analyzeTable(tableName: string, columns?: string[]): Promise<any> {
    console.log('[MCP] Appel analyzeTable:', tableName, 'columns:', columns);
    const response = await lastValueFrom(
      this.httpService.post(`${this.baseUrl}/api/analyze/${tableName}`, {
        columns,
      }),
    );
    console.log('[MCP] Résultat analyzeTable:', response.data);
    return response.data;
  }

  async getSchema(): Promise<any> {
    console.log('[MCP] Appel getSchema');
    const response = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/api/schema`),
    );
    console.log('[MCP] Résultat getSchema:', response.data);
    return response.data;
  }

  // Ancienne méthode pour compatibilité temporaire
  async query(sql: string): Promise<any> {
    console.log('[MCP] Appel query:', sql);
    const result = await this.executeQuery(sql);
    console.log('[MCP] Résultat query:', result);
    return result;
  }

  async getDocument(id: string): Promise<any> {
    console.log('[MCP] Appel getDocument:', id);
    const response = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/documents/${id}`),
    );
    console.log('[MCP] Résultat getDocument:', response.data);
    return response.data;
  }
}
