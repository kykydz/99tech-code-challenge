import {
  DataSource,
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  EntityTarget,
} from 'typeorm';

/**
 * Base TypeORM Repository
 *
 * Provides common CRUD operations for all TypeORM repositories.
 * This is a generic base class that can be extended by specific entity repositories.
 *
 * @template T - The entity type that must have an 'id' property
 */
export abstract class TypeOrmBaseRepository<
  T extends ObjectLiteral & { id: string }
> {
  protected repository: Repository<T>;

  constructor(
    protected dataSource: DataSource,
    private entityClass: EntityTarget<T>
  ) {
    this.repository = dataSource.getRepository(entityClass);
  }

  /**
   * Create and save a new entity
   */
  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  /**
   * Update an existing entity
   */
  async update(id: string, entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Check if entity exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  /**
   * Count all entities
   */
  async count(): Promise<number> {
    return await this.repository.count();
  }
}
