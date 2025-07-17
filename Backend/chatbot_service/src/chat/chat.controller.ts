import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import { SessionService } from '../session.service';
import { SecurityService } from '../security.service';
import { AnswerFormatterService, FormattedAnswer } from '../answer-formatter.service';

interface AskRequest {
  question: string;
  sessionId?: string;
  page?: number;
  limit?: number;
}

interface AskResponse {
  answer: string;
  sessionId: string;
  formattedResponse?: FormattedAnswer;
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
    private readonly answerFormatter: AnswerFormatterService,
  ) {}

  @Post()
  async ask(@Body() body: AskRequest): Promise<AskResponse> {
    const { question, sessionId, page = 1, limit = 10 } = body;

    this.logger.log(`=== DÉBUT REQUÊTE ===`, {
      question:
        question?.substring(0, 50) + (question?.length > 50 ? '...' : ''),
      sessionId,
      page,
      limit,
      userAgent: 'Frontend/Electron',
    });

    // Validation de la pagination
    const paginationValidation = this.securityService.validatePagination(
      page,
      limit,
    );
    if (!paginationValidation.isValid) {
      this.logger.error(`Erreur validation pagination`, {
        error: paginationValidation.error,
      });
      throw new HttpException(
        paginationValidation.error || 'Erreur de validation de pagination',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sessionIdFinal = sessionId || `session_${Date.now()}`;

    this.logger.log(`Nouvelle question reçue`, {
      sessionId: sessionIdFinal,
      questionLength: question.length,
      page,
      limit,
    });

    try {
      const answer = await this.openaiService.chatWithTools(
        question,
        sessionIdFinal,
      );

      // Vérifier si la réponse contient une erreur
      if (answer && answer.includes('Erreur lors du traitement')) {
        this.logger.error(`Erreur détectée dans la réponse`, {
          sessionId: sessionIdFinal,
          answer,
        });
        throw new HttpException(answer, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      this.logger.log(`Réponse générée avec succès`, {
        sessionId: sessionIdFinal,
        answerLength: answer.length,
      });

      // Essayer de formater la réponse si c'est une requête de données
      let formattedResponse: FormattedAnswer | undefined;
      try {
        // Vérifier si la réponse contient des données JSON (cas où OpenAI a utilisé un outil)
        const sessionMessages = await this.sessionService.getSession(sessionIdFinal);
        const lastFunctionMessage = sessionMessages
          .filter((msg) => msg.role === 'function')
          .pop();

        if (lastFunctionMessage && lastFunctionMessage.content) {
          const functionResult = JSON.parse(lastFunctionMessage.content) as any;
          if (
            functionResult.data &&
            Array.isArray(functionResult.data) &&
            functionResult.data.length > 0
          ) {
            const { summary, tables, markdownTable, suggestions, exportLink, chartSuggestion, details } = functionResult.data[0];
            formattedResponse = this.answerFormatter.format(summary, tables, markdownTable, suggestions, exportLink, chartSuggestion, details);
          }
        }
      } catch (formatError) {
        this.logger.warn('Erreur lors du formatage de la réponse', {
          error: formatError,
        });
      }

      const response = {
        answer,
        sessionId: sessionIdFinal,
        formattedResponse,
        pagination: {
          page: paginationValidation.sanitized!.page,
          limit: paginationValidation.sanitized!.limit,
          total: 0, // À implémenter si nécessaire
        },
      };

      this.logger.log(`=== FIN REQUÊTE SUCCÈS ===`, {
        sessionId: sessionIdFinal,
        responseLength: JSON.stringify(response).length,
      });

      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';

      this.logger.error(`Erreur lors du traitement de la question`, {
        sessionId: sessionIdFinal,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof HttpException) {
        this.logger.error(`=== FIN REQUÊTE ERREUR HTTP ===`, {
          status: error.getStatus(),
          message: error.message,
        });
        throw error;
      }

      this.logger.error(`=== FIN REQUÊTE ERREUR INTERNE ===`, {
        message: errorMessage,
      });

      throw new HttpException(
        `Erreur lors du traitement : ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      messageCount: messages.length,
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
