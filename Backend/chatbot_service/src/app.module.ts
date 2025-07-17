import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { OpenAIService } from './openai.service';
import { MCPClientService } from './mcp/mcp-client.service';
import { ChatController } from './chat/chat.controller';
import { AnswerFormatterService } from './answer-formatter.service';
import { SessionService } from './session.service';
import { SecurityService } from './security.service';
import { PromptService } from './prompt.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ChatController],
  providers: [
    OpenAIService, 
    MCPClientService, 
    AnswerFormatterService,
    SessionService,
    SecurityService,
    PromptService
  ],
})
export class AppModule {}
