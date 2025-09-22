import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma/prisma.service';
import { IMovementsRepository } from '../../domain/interfaces/movements.repository.interface';
import { Movement } from '../../domain/entities/movement.entity';

@Injectable()
export class MovementsPrismaRepository implements IMovementsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(movement: Partial<Movement>): Promise<Movement> {
    return this.prisma.movement.create({ data: movement as any });
  }
}
