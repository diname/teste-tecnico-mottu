import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { IAccountsRepository } from '../../../domain/interfaces/accounts.repository.interface';
import { Account } from '../../../domain/entities/account.entity';

@Injectable()
export class AccountsPrismaRepository implements IAccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(account: Partial<Account>): Promise<Account> {
    return this.prisma.account.create({ data: account });
  }

  async findById(id: string): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async updateBalance(id: string, amount: number): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data: { balance: { increment: amount } },
    });
  }
}
