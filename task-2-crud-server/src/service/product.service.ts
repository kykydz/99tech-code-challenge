import { Product } from '../domain/entities/product.entity';
import { ProductRepositoryPort } from '../domain/repositories/product.repository.port';
import { CreateProductDto } from '../presentation/dtos/product.dto';

/**
 * Product Service - Application Layer
 *
 * Contains the business logic and use cases for product management.
 * Orchestrates operations between the domain and infrastructure layers
 */
export class ProductService {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async createProduct(product: CreateProductDto): Promise<Product> {
    const createdProduct = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await this.productRepository.create(createdProduct);
  }

  /**
   * Get a product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  /**
   * Update a product
   */
  async updateProduct(
    id: string,
    name?: string,
    description?: string,
    price?: number,
    stock?: number
  ): Promise<Product> {
    const existingProduct = await this.getProductById(id);

    // Update fields if provided
    if (name !== undefined) existingProduct.name = name;
    if (description !== undefined) existingProduct.description = description;
    if (price !== undefined) existingProduct.price = price;
    if (stock !== undefined) existingProduct.stock = stock;

    return await this.productRepository.update(id, existingProduct);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    // Verify product exists before deleting
    await this.getProductById(id);

    const deleted = await this.productRepository.delete(id);

    if (!deleted) {
      throw new Error(`Failed to delete product with ID ${id}`);
    }
  }
}
