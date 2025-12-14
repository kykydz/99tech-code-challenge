import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../../service/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../dtos/product.dto';
import { Product } from '../../domain/entities/product.entity';

/**
 * Product Controller - Presentation Layer
 *
 * Handles HTTP requests and responses for product operations.
 */
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Map Product entity to response DTO
   */
  private toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id!,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  /**
   * Create a new product
   * POST /api/products
   */
  createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productToCreate = req.body as CreateProductDto;

      const product = await this.productService.createProduct(productToCreate);

      res.status(201).json({
        success: true,
        data: this.toResponseDto(product),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all products
   * GET /api/products
   */
  getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();

      res.status(200).json({
        success: true,
        data: products.map((p) => this.toResponseDto(p)),
        count: products.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a product by ID
   * GET /api/products/:id
   */
  getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const product = await this.productService.getProductById(id);

      res.status(200).json({
        success: true,
        data: this.toResponseDto(product),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a product
   * PUT /api/products/:id
   */
  updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const { name, description, price, stock } = req.body as UpdateProductDto;

      const product = await this.productService.updateProduct(
        id,
        name,
        description,
        price,
        stock
      );

      res.status(200).json({
        success: true,
        data: this.toResponseDto(product),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a product
   * DELETE /api/products/:id
   */
  deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      await this.productService.deleteProduct(id);

      res.status(200).json({
        success: true,
        message: `Product with ID ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  };
}
