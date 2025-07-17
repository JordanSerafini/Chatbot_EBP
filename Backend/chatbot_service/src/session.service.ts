import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export interface Message {
  role: 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  timestamp: string;
}

interface SessionData {
  id: string;
  messages: Message[];
  createdAt: string;
  lastActivity: string;
}

interface Data {
  sessions: SessionData[];
}

const dbFile = join(__dirname, '../.sessions.json');

@Injectable()
export class SessionService {
  private db: Low<Data>;

  constructor() {
    const adapter = new JSONFile<Data>(dbFile);
    this.db = new Low<Data>(adapter, { sessions: [] });
  }

  async load(): Promise<void> {
    await this.db.read();
    if (!this.db.data) this.db.data = { sessions: [] };
  }

  async getSession(sessionId: string): Promise<Message[]> {
    await this.load();
    const session = this.db.data.sessions.find((s) => s.id === sessionId);
    return session ? session.messages : [];
  }

  async saveMessage(sessionId: string, message: Message): Promise<void> {
    await this.load();
    let session = this.db.data.sessions.find((s) => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      this.db.data.sessions.push(session);
    }

    // Ajouter timestamp si manquant
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString();
    }

    session.messages.push(message);
    session.lastActivity = new Date().toISOString();

    // Limiter l'historique à 50 messages par session
    if (session.messages.length > 50) {
      session.messages = session.messages.slice(-50);
    }

    await this.db.write();
  }

  async setSession(sessionId: string, messages: Message[]): Promise<void> {
    await this.load();
    let session = this.db.data.sessions.find((s) => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      this.db.data.sessions.push(session);
    }
    session.messages = messages;
    session.lastActivity = new Date().toISOString();
    await this.db.write();
  }

  async cleanupOldSessions(maxAgeHours: number = 24): Promise<void> {
    await this.load();
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    this.db.data.sessions = this.db.data.sessions.filter(
      (session) => new Date(session.lastActivity) > cutoff,
    );
    await this.db.write();
  }
}