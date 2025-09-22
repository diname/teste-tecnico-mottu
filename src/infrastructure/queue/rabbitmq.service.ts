import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { IRabbitMQService } from './rabbitmq.interface';
import { ConfigService } from '@Shared/database/config/config.service';

@Injectable()
export class RabbitMQService
  implements OnModuleInit, OnModuleDestroy, IRabbitMQService
{
  private connection: amqp.Connection;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  async connect(): Promise<void> {
    try {
      const amqpUrl = this.configService.get<string>('RABBITMQ_URL');
      if (amqpUrl) {
        this.connection = await amqp.connect(amqpUrl);
        console.log('Successfully connected to RabbitMQ.');
      } else {
        console.error('RABBITMQ_URL is not defined in the configuration.');
      }
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      if (this.connection.close) {
        await this.connection.close();
        console.log('RabbitMQ connection closed.');
      } else {
        console.warn('RabbitMQ connection does not have a close method.');
      }
    }
  }

  getConnection(): amqp.Connection {
    if (!this.connection) {
      throw new Error('RabbitMQ connection not established.');
    }
    return this.connection;
  }
}
