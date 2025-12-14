import { DataSource } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { TypeOrmBaseRepository } from './base.sqlite.repository';

/**
 * TypeORM Product Repository Implementation (Adapter)
 *
 * Extends TypeOrmBaseRepository to inherit common CRUD operations.
 * Implements the ProductRepository interface using TypeORM.
 * This is an adapter in hexagonal architecture.
 * Receives DataSource via dependency injection.
 */
export class SQLiteTypeOrmProductRepository extends TypeOrmBaseRepository<Product> {
  constructor(dataSource: DataSource) {
    super(dataSource, Product);
  }
}
