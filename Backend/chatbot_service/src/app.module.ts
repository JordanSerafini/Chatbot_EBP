import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainService } from './langchain/langchain.service';
import { MCPClientService } from './mcp/mcp-client.service';
import { ChatController } from './chat/chat.controller';
import { IntentDetectorService } from './chat/intent-detector.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [ChatController],
  providers: [LangchainService, MCPClientService, IntentDetectorService],
})
export class AppModule {}
