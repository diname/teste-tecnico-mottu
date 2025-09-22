import { Injectable } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';

@Injectable()
export class GetAccountBalanceUseCase {
  constructor(private readonly accountsService: AccountsService) {}

  async execute(
    accountId: string,
  ): Promise<{ balance: number; availableCredit: number }> {
    return this.accountsService.getAccountBalance(accountId);
  }
}
