import { DynamicTool } from 'langchain/tools';
import { MCPClientService } from '../mcp/mcp-client.service';

export function createLangchainTools(mcpClient: MCPClientService) {
  return [
    new DynamicTool({
      name: 'queryMCP',
      description: 'Envoie une requête SQL ou structurée au serveur MCP et retourne le résultat.',
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
