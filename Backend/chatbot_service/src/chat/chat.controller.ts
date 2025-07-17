import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import { SessionService } from '../session.service';
import { SecurityService } from '../security.service';

interface AskRequest {
  question: string;
  sessionId?: string;
  page?: number;
  limit?: number;
}

interface AskResponse {
  answer: string;
  sessionId: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

@Controller('ask')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly sessionService: SessionService,
    private readonly securityService: SecurityService,
  ) {}

  @Post()
  async ask(@Body() body: AskRequest): Promise<AskResponse> {
    const { question, sessionId, page = 1, limit = 10 } = body;
    
    // Validation de la pagination
    const paginationValidation = this.securityService.validatePagination(page, limit);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.error);
    }

    const sessionIdFinal = sessionId || `session_${Date.now()}`;
    
    this.logger.log(`Nouvelle question reçue`, { 
      sessionId: sessionIdFinal, 
      questionLength: question.length,
      page,
      limit 
    });

    const answer = await this.openaiService.chatWithTools(question, sessionIdFinal);
    
    this.logger.log(`Réponse générée avec succès`, { 
      sessionId: sessionIdFinal, 
      answerLength: answer.length 
    });

    return {
      answer,
      sessionId: sessionIdFinal,
      pagination: {
        page: paginationValidation.sanitized!.page,
        limit: paginationValidation.sanitized!.limit,
        total: 0, // À implémenter si nécessaire
      },
    };
  }

  @Get()
  getHello() {
    return { status: 'ok' };
  }

  @Get('session/:sessionId')
  async getSessionHistory(@Query('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new Error('SessionId requis');
    }

    const messages = await this.sessionService.getSession(sessionId);
    
    this.logger.log(`Historique de session récupéré`, { 
      sessionId, 
      messageCount: messages.length 
    });

    return {
      sessionId,
      messages,
      messageCount: messages.length,
    };
  }

  @Post('session/:sessionId/clear')
  async clearSession(@Query('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new Error('SessionId requis');
    }

    await this.sessionService.setSession(sessionId, []);
    
    this.logger.log(`Session effacée`, { sessionId });

    return {
      sessionId,
      message: 'Session effacée avec succès',
    };
  }
}
