import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  private notion: Client;

  constructor() {
    this.notion = new Client({
      auth: 'your-secret-api-key',
    });
  }

  async queryDatabase(databaseId: string, options: any = {}) {
    try {
      const response = await this.notion.databases.query({
        database_id: databaseId,
        ...options,
      });
      return response.results;
    } catch (error) {
      console.error('Notion API error:', error);
      throw error;
    }
  }
}
