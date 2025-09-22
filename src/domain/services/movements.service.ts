import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IAccountsRepository } from '../../accounts/domain/interfaces/accounts.repository.interface';
import { IMovementsRepository } from '../domain/interfaces/movements.repository.interface';
import { Movement, MovementType } from '../domain/entities/movement.entity';
import { RabbitMQProducer } from '../infrastructure/queue/rabbitmq.producer';

@Injectable()
export class MovementsService {
  constructor(
    @Inject('IAccountsRepository')
    private readonly accountsRepository: IAccountsRepository,
    @Inject('IMovementsRepository')
    private readonly movementsRepository: IMovementsRepository,
    private readonly rabbitmqProducer: RabbitMQProducer,
  ) {}

  async createMovement(
    accountId: string,
    amount: number,
    type: MovementType,
    description: string,
  ): Promise<Movement> {
    const account = await this.accountsRepository.findById(accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (
      type === MovementType.DEBIT &&
      account.balance + account.creditLimit < amount
    ) {
      throw new BadRequestException('Insufficient funds');
    }

    const newBalance = type === MovementType.CREDIT ? amount : -amount;

    const [updatedAccount, movement] = await Promise.all([
      this.accountsRepository.updateBalance(accountId, newBalance),
      this.movementsRepository.create({ accountId, amount, type, description }),
    ]);

    await this.rabbitmqProducer.sendMessage('ledger-log-queue', {
      movementId: movement.id,
      accountId: movement.accountId,
      amount: movement.amount,
      type: movement.type,
      description: movement.description,
      newBalance: updatedAccount.balance,
      logDate: new Date().toISOString(),
    });

    return movement;
  }
}
