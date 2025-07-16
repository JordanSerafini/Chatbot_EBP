import * as chalk from 'chalk';
import { LoggerService } from '@nestjs/common';

export class MigrationLogger {
  private warnings: string[] = [];
  private errors: string[] = [];
  private startTime: number;

  constructor(
    private readonly context: string = 'Synchronization',
    private readonly nestLogger?: LoggerService,
  ) {}

  private log(
    level: 'INFO' | 'WARN' | 'ERROR',
    message: string,
    data?: any,
    isRaw = false,
  ) {
    // 1. Log en console avec Chalk (pour la lisibilité humaine)
    const timestamp = new Date().toLocaleTimeString();
    if (!isRaw) {
      let levelColor: (text: string) => string;
      switch (level) {
        case 'INFO':
          levelColor = chalk.blue.bold;
          break;
        case 'WARN':
          levelColor = chalk.yellow.bold;
          if (!this.warnings.includes(message)) this.warnings.push(message);
          break;
        case 'ERROR':
          levelColor = chalk.red.bold;
          if (!this.errors.includes(message)) this.errors.push(message);
          break;
      }
      console.log(
        `[${chalk.green(timestamp)}] ${levelColor(level.padEnd(5))} [${chalk.cyan(
          this.context,
        )}] ${message}`,
      );
    } else {
      console.log(message);
    }

    if (data) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }

    // 2. Log dans les fichiers via le logger Nest/Winston
    if (this.nestLogger) {
      const fileMessage = data ? `${message} ${JSON.stringify(data)}` : message;
      switch (level) {
        case 'INFO':
          this.nestLogger.log(fileMessage, this.context);
          break;
        case 'WARN':
          this.nestLogger.warn(fileMessage, this.context);
          break;
        case 'ERROR':
          this.nestLogger.error(fileMessage, this.context);
          break;
      }
    }
  }

  start(message: string) {
    this.startTime = Date.now();
    const styledMessage = chalk.bold.magentaBright(`\n🚀 ${message} 🚀\n`);
    this.log('INFO', styledMessage, undefined, true);
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  error(message: string, error?: any) {
    this.log('ERROR', message);
    if (error) {
      console.error(chalk.red(error.stack || error));
      if (this.nestLogger) {
        this.nestLogger.error(error.stack || error, error.stack, this.context);
      }
    }
  }

  step(message: string) {
    const styledMessage = chalk.bold.cyan(`\n🔹 ${message}...`);
    this.log('INFO', styledMessage, undefined, true);
  }

  success(message: string) {
    const styledMessage = chalk.green(`✅ ${message}`);
    this.log('INFO', styledMessage, undefined, true);
  }

  summary() {
    if (!this.startTime) {
      this.warn(
        'Le résumé a été appelé sans que le timer de migration ne soit démarré.',
      );
      return;
    }
    const duration = (Date.now() - this.startTime) / 1000;

    const summaryLines = [
      `\n🏁 Résumé de la migration 🏁\n`,
      `⏱️  Durée totale: ${duration.toFixed(2)} secondes`,
      `${this.warnings.length} avertissements ont été émis.`,
      ...this.warnings.map((w) => `  - ${w}`),
      `${this.errors.length} erreurs critiques sont survenues.`,
      ...this.errors.map((e) => `  - ${e}`),
      `\n----------------------------------------\n`,
    ];

    // Log en console avec les couleurs
    const styledSummary = summaryLines.join('\n')
      .replace(/🏁/g, chalk.bold.magentaBright('🏁'))
      .replace(/⏱️/g, chalk.yellow('⏱️'))
      .replace(/avertissements/g, chalk.yellow.bold('avertissements'))
      .replace(/erreurs critiques/g, chalk.red.bold('erreurs critiques'));
    
    console.log(styledSummary)

    // Log dans les fichiers sans les couleurs
    if (this.nestLogger) {
        this.nestLogger.log(summaryLines.join('\n'), this.context)
    }
  }
} 