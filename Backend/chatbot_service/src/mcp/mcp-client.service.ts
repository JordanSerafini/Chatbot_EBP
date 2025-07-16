import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MCPClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('MCP_SERVER_URL');
  }

  async query(sql: string): Promise<any> {
    const { data } = await this.httpService.post(`${this.baseUrl}/query`, { sql }).toPromise();
    return data;
  }

  async getDocument(id: string): Promise<any> {
    const { data } = await this.httpService.get(`${this.baseUrl}/documents/${id}`).toPromise();
    return data;
  }
}
