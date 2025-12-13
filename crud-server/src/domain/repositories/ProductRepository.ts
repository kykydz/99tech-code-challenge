import { Product } from '../entities/Product';

/**
 * Product Repository Interface (Port)
 *
 * Defines the contract for product persistence operations.
 * This is a port in hexagonal architecture - an interface that adapters must implement.
 */
export interface ProductRepository {
  /**
   * Create a new product
   */
  create(product: Product): Promise<Product>;

  /**
   * Find a product by its ID
   */
  findById(id: number): Promise<Product | null>;

  /**
   * Find all products
   */
  findAll(): Promise<Product[]>;

  /**
   * Update an existing product
   */
  update(product: Product): Promise<Product>;

  /**
   * Delete a product by its ID
   */
  delete(id: number): Promise<boolean>;
}
