
import { Injectable } from '@nestjs/common';
import { MCPClientService } from './mcp/mcp-client.service';

@Injectable()
export class AnalysisOrchestratorService {
  constructor(private readonly mcp: MCPClientService) {}

  /**
   * Orchestration complète : listage, description, analyse, requête
   */
  async fullAnalysisWorkflow(
    query: string,
    tableNames: string[],
    columns?: string[],
  ): Promise<any> {
    // 1. Lister les tables
    const tables = await this.mcp.listTables();
    // 2. Décrire les tables pertinentes
    const descriptions = await Promise.all(
      tableNames.map((t) => this.mcp.describeTable(t)),
    );
    // 3. Analyse statistique (optionnel)
    const analyses = await Promise.all(
      tableNames.map((t) => this.mcp.analyzeTable(t, columns)),
    );
    // 4. Exécuter la requête SQL
    const result = await this.mcp.executeQuery(query);
    return {
      tables,
      descriptions,
      analyses,
      result,
    };
  }

  /**
   * Orchestration multi-analyses : permet d'enchaîner plusieurs requêtes/analyses pour enrichir la réponse
   */
  async orchestrateMultiAnalysis(
    queries: {
      query: string;
      tableNames: string[];
      columns?: string[];
      label?: string;
    }[],
  ): Promise<any[]> {
    // Exécute chaque analyse en parallèle, retourne un tableau de résultats labellisés
    return Promise.all(
      queries.map(
        async ({ query, tableNames, columns, label }) => {
          const result = await this.fullAnalysisWorkflow(
            query,
            tableNames,
            columns,
          );
          return { label, ...result };
        },
      ),
    );
  }
} 