import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { OpenAIService } from './openai.service';
import { MCPClientService } from './mcp/mcp-client.service';
import { ChatController } from './chat/chat.controller';
import { AnswerFormatterService } from './answer-formatter.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ChatController],
  providers: [OpenAIService, MCPClientService, AnswerFormatterService],
})
export class AppModule {}
