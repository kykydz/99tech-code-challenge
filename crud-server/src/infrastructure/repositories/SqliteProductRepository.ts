import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { DatabaseConnection } from '../database/DatabaseConnection';

/**
 * TypeORM Product Repository Implementation (Adapter)
 *
 * Implements the ProductRepository interface using TypeORM.
 * This is an adapter in hexagonal architecture.
 */
export class TypeOrmProductRepository implements ProductRepository {
  private repository: Repository<Product>;

  constructor() {
    const dataSource = DatabaseConnection.getExistingDataSource();
    this.repository = dataSource.getRepository(Product);
  }

  async create(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }

  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async update(product: Product): Promise<Product> {
    if (!product.id) {
      throw new Error('Product ID is required for update');
    }

    await this.repository.save(product);
    return product;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
