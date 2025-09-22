import { AccountsService } from '@Domain/services/accounts.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateAccountUseCase {
  constructor(private readonly accountsService: AccountsService) {}

  async execute(
    name: string,
    document: string,
    email: string,
  ): Promise<{ accountId: string }> {
    const account = await this.accountsService.createAccount(
      name,
      document,
      email,
    );
    return { accountId: account.id };
  }
}
