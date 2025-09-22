export enum MovementType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export class Movement {
  id: string;
  accountId: string;
  amount: number;
  type: MovementType;
  description: string;
  createdAt: Date;
}
