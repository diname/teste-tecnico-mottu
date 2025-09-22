export class Account {
  id: string;
  name: string;
  document: string;
  email: string;
  balance: number;
  creditLimit: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    document: string,
    email: string,
    balance: number,
    creditLimit: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.document = document;
    this.email = email;
    this.balance = balance;
    this.creditLimit = creditLimit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
