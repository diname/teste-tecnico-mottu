import { Movement } from '../entities/movement.entity';

export interface IMovementsRepository {
  create(movement: Partial<Movement>): Promise<Movement>;
}

export const IMovementsRepositoryToken = 'IMovementsRepository';
