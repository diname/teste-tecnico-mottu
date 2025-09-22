import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '../../../shared/config/config.service';

@Injectable()
export class RabbitMQProducer implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const amqpUrl = this.configService.get('RABBITMQ_URL');
      this.connection = await amqp.connect(amqpUrl);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async sendMessage(queueName: string, message: object) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not available.');
      return;
    }
    const messageBuffer = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(queueName, messageBuffer, { persistent: true });
  }
}
