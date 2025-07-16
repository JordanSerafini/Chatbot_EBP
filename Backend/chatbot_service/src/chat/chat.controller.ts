import { Controller, Post, Body, Get } from '@nestjs/common';
import { OpenAIService } from '../openai.service';

@Controller('ask')
export class ChatController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post()
  async ask(
    @Body('question') question: string,
    @Body('sessionId') sessionId?: string,
  ) {
    const answer = await this.openaiService.chatWithTools(question, sessionId);
    console.log('CONTROLLER ANSWER:', answer);
    return { answer };
  }

  @Get()
  getHello() {
    return { status: 'ok' };
  }
}
