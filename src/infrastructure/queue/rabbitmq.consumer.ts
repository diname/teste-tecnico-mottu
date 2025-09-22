import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { PrismaService } from '../../../shared/database/prisma/prisma.service';
import { ConfigService } from '../../../shared/config/config.service';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const amqpUrl = this.configService.get('RABBITMQ_URL');
    const queueName = 'ledger-log-queue';

    try {
      const connection = await amqp.connect(amqpUrl);
      const channel = await connection.createChannel();

      await channel.assertQueue(queueName, { durable: true });
      channel.consume(queueName, async (msg) => {
        if (msg !== null) {
          try {
            const logData = JSON.parse(msg.content.toString());
            await this.prisma.ledgerLog.create({
              data: {
                movementId: logData.movementId,
                logData: logData,
              },
            });
            console.log('Ledger log saved to database:', logData);
            channel.ack(msg);
          } catch (error) {
            console.error(
              'Failed to process message or save to database:',
              error,
            );
            channel.nack(msg);
          }
        }
      });
      console.log('RabbitMQ consumer started...');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }
}
