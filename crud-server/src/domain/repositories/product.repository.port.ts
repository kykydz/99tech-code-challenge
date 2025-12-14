import { Product } from '../entities/product.entity';
import { IBaseRepositoryPort } from './base.repository.port';

/**
 * Product Repository Interface (Port)
 *
 * Defines the contract for product persistence operations.
 * This is a port in hexagonal architecture - an interface that adapters must implement.
 */
export interface ProductRepositoryPort extends IBaseRepositoryPort<Product> {}
