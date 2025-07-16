import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { OpenAIService } from './openai.service';
import { MCPClientService } from './mcp/mcp-client.service';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [ChatController],
  providers: [OpenAIService, MCPClientService],
})
export class AppModule {}
