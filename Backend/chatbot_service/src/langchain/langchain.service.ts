import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';
import type { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { createLangchainTools } from './langchain.tools';
import { MCPClientService } from '../mcp/mcp-client.service';

// Type minimal pour AgentExecutor

type AgentExecutorLike = {
  invoke: (input: any) => Promise<any>;
};

@Injectable()
export class LangchainService implements OnModuleInit {
  private executor: AgentExecutorLike | null = null;
  private readonly logger = new Logger(LangchainService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mcpClient: MCPClientService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.executor) return;

    const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY') as string | undefined;
    if (!openAIApiKey) {
      this.logger.error('Clé OPENAI_API_KEY manquante');
      return;
    }

    try {
      const model = new ChatOpenAI({
        openAIApiKey,
        modelName: 'gpt-4o',
        temperature: 0.2,
      });

      const tools = createLangchainTools(this.mcpClient);

      const prompt = await pull<ChatPromptTemplate>(
        'hwchase17/openai-functions-agent',
      );

      const agent = await createOpenAIFunctionsAgent({
        llm: model,
        tools,
        prompt,
      });

      this.executor = new AgentExecutor({
        agent,
        tools,
      }) as unknown as AgentExecutorLike;

      this.logger.log('✅ LangChain agent initialisé');
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`❌ Erreur init LangChain : ${err.message}`);
      this.executor = null;
    }
  }

  async ask(question: string, sessionId?: string): Promise<string> {
    if (!this.executor) {
      await this.onModuleInit();
      if (!this.executor) return 'Erreur : agent non initialisé';
    }

    try {
      const result = await this.executor.invoke({
        input: question,
        sessionId,
      });

      if (
        typeof result === 'object' &&
        result !== null &&
        'output' in result &&
        typeof (result as { output?: unknown }).output === 'string'
      ) {
        return (result as { output: string }).output;
      }

      return 'Aucune réponse générée.';
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Erreur exécution agent : ${err.message}`);
      return 'Erreur lors de la génération de réponse.';
    }
  }
}
