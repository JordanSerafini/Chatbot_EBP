import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainService } from './langchain.service';
import { MCPClientService } from './mcp-client.service';
import { ChatController } from './chat.controller';
import { IntentDetectorService } from './intent-detector.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [ChatController],
  providers: [LangchainService, MCPClientService, IntentDetectorService],
})
export class AppModule {}
