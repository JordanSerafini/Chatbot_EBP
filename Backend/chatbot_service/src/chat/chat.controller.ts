import { Controller, Post, Body, Get } from '@nestjs/common';
import { LangchainService } from '../langchain/langchain.service';

@Controller('ask')
export class ChatController {
  constructor(private readonly langchainService: LangchainService) {}

  @Post()
  async ask(
    @Body('question') question: string,
    @Body('sessionId') sessionId?: string,
  ) {
    const answer = await this.langchainService.ask(question, sessionId);
    return { answer };
  }

  @Get()
  getHello() {
    return { status: 'ok' };
  }
}
