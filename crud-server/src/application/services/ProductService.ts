import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

/**
 * Product Service - Application Layer
 *
 * Contains the business logic and use cases for product management.
 * Orchestrates operations between the domain and infrastructure layers.
 */
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * Create a new product
   */
  async createProduct(
    name: string,
    description: string,
    price: number,
    stock: number
  ): Promise<Product> {
    const product = Product.create(name, description, price, stock);
    return await this.productRepository.create(product);
  }

  /**
   * Get a product by ID
   */
  async getProductById(id: number): Promise<Product> {
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
    id: number,
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

    return await this.productRepository.update(existingProduct);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<void> {
    // Verify product exists before deleting
    await this.getProductById(id);

    const deleted = await this.productRepository.delete(id);

    if (!deleted) {
      throw new Error(`Failed to delete product with ID ${id}`);
    }
  }
}
