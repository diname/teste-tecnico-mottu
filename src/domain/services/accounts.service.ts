import { Inject, Injectable } from '@nestjs/common';
import { IAccountsRepository } from '../../domain/interfaces/accounts.repository.interface';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('IAccountsRepository')
    private readonly accountsRepository: IAccountsRepository,
  ) {}

  async createAccount(
    name: string,
    document: string,
    email: string,
  ): Promise<Account> {
    const initialCreditLimit = 1000;
    const account = await this.accountsRepository.create({
      name,
      document,
      email,
      creditLimit: initialCreditLimit,
    });
    return account;
  }

  async getAccountBalance(
    accountId: string,
  ): Promise<{ balance: number; availableCredit: number }> {
    const account = await this.accountsRepository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const availableCredit = account.balance + account.creditLimit;
    return {
      balance: account.balance,
      availableCredit,
    };
  }
}
