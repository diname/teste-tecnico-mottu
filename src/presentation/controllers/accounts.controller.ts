import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateAccountUseCase } from '@Application/use-cases/create-account.use-case';
import { GetAccountBalanceUseCase } from '@Application/use-cases/get-account-balance.use-case';
import { AccountRequestDto } from '@Application/dtos/request/account.request.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getAccountBalanceUseCase: GetAccountBalanceUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova conta' })
  @ApiResponse({ status: 201, description: 'Conta criada com sucesso.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        document: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['name', 'document', 'email'],
    },
  })
  async create(@Body() dto: AccountRequestDto, @Res() res: Response) {
    const result = await this.createAccountUseCase.execute(
      dto.name,
      dto.document,
      dto.email,
    );
    res.status(HttpStatus.CREATED).json(result);
  }

  @Get(':id/balance')
  @ApiOperation({
    summary:
      'Retorna o saldo atual e o limite de crédito disponível de uma conta',
  })
  @ApiResponse({
    status: 200,
    description: 'Saldo da conta retornado com sucesso.',
  })
  async getBalance(@Param('id') accountId: string) {
    return await this.getAccountBalanceUseCase.execute(accountId);
  }
}
