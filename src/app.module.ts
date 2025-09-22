import { Module } from '@nestjs/common';
import { ConfigModule } from '@Shared/database/config/config.module';
import { AccountsController } from './presentation/controllers/accounts.controller';
import { PrismaService } from '@Shared/database/prisma/prisma.service';
import { AccountsService } from '@Domain/services/accounts.service';
import { CreateAccountUseCase } from '@Application/use-cases/create-account.use-case';
import { GetAccountBalanceUseCase } from '@Application/use-cases/get-account-balance.use-case';
import { AccountsPrismaRepository } from '@Infrastructure/prisma/accounts-prisma.repository';
import { MovementsService } from '@Domain/services/movements.service';
import { RabbitMQProducer } from '@Infrastructure/queue/rabbitmq.producer';
import { RabbitMQConsumer } from '@Infrastructure/queue/rabbitmq.consumer';
import { MovementsPrismaRepository } from '@Infrastructure/prisma/movements-prisma.repository';
import { RabbitMQService } from '@Infrastructure/queue/rabbitmq.service';
import { IMovementsRepository } from '@Domain/interfaces/movements.repository.interface';
import { IAccountsRepository } from '@Domain/interfaces/accounts.repository.interface';

@Module({
  imports: [ConfigModule],
  controllers: [AccountsController],
  providers: [
    PrismaService,
    AccountsService,
    CreateAccountUseCase,
    GetAccountBalanceUseCase,
    {
      provide: 'IAccountsRepository',
      useClass: AccountsPrismaRepository as unknown as {
        new (...args: any[]): IAccountsRepository;
      },
    },
    MovementsService,
    RabbitMQProducer,
    RabbitMQConsumer,
    {
      provide: 'IMovementsRepository',
      useClass: MovementsPrismaRepository as unknown as {
        new (...args: any[]): IMovementsRepository;
      },
    },
    {
      provide: 'IRabbitMQService',
      useClass: RabbitMQService,
    },
  ],
})
export class AppModule {}
