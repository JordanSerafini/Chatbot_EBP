import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { createOpenAIFunctionsAgent, AgentExecutor, getDefaultOpenAIFunctionsAgentPrompt } from 'langchain/agents';
import { createLangchainTools } from './langchain.tools';
import { MCPClientService } from '../mcp/mcp-client.service';

@Injectable()
export class LangchainService {
  private executor: AgentExecutor;
  private readonly logger = new Logger(LangchainService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mcpClient: MCPClientService,
  ) {}

  async onModuleInit() {
    const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');
    const model = new ChatOpenAI({
      openAIApiKey,
      modelName: 'gpt-4o',
      temperature: 0.2,
    });
    const tools = createLangchainTools(this.mcpClient);
    const prompt = await getDefaultOpenAIFunctionsAgentPrompt();
    const agent = await createOpenAIFunctionsAgent({ llm: model, tools, prompt });
    this.executor = new AgentExecutor({ agent, tools });
    this.logger.log('LangChain agent initialisé avec tools MCP.');
  }

  async ask(question: string, sessionId?: string): Promise<string> {
    if (!this.executor) {
      await this.onModuleInit();
    }
    const result = await this.executor.invoke({ input: question, sessionId });
    return result.output;
  }
}
