import { DynamicTool } from 'langchain/tools';
import type { Tool } from 'langchain/tools';
import type { MCPClientService } from '../mcp/mcp-client.service';

/**
 * Génère la liste des outils LangChain reliés au MCP server.
 * @param mcpClient Service métier (HTTP) pour accéder aux données
 */
export function createLangchainTools(mcpClient: MCPClientService): Tool[] {
  return [
    new DynamicTool({
      name: 'queryMCP',
      description:
        'Envoie une requête SQL ou structurée au serveur MCP et retourne le résultat.',
      func: async (input: string): Promise<string> => {
        try {
          const res = await mcpClient.query(input);
          return JSON.stringify(res);
        } catch (e: unknown) {
          if (e instanceof Error) return `Erreur MCP: ${e.message}`;
          return 'Erreur MCP inconnue';
        }
      },
    }),
    new DynamicTool({
      name: 'getDocument',
      description: 'Récupère un document métier par son ID via le serveur MCP.',
      func: async (id: string): Promise<string> => {
        try {
          const res = await mcpClient.getDocument(id);
          return JSON.stringify(res);
        } catch (e: unknown) {
          if (e instanceof Error) return `Erreur MCP: ${e.message}`;
          return 'Erreur MCP inconnue';
        }
      },
    }),
  ];
}
