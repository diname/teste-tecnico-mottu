import { Account } from '../entities/account.entity';

export interface IAccountsRepository {
  create(account: Partial<Account>): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  updateBalance(id: string, amount: number): Promise<Account>;
}

export const IAccountsRepositoryToken = 'IAccountsRepository';
