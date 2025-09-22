import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountRequestDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do titular da conta',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'Número do documento (CPF ou CNPJ) do titular da conta',
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({
    example: 'testemottu@gmail.com',
    description: 'E-mail do titular da conta',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
