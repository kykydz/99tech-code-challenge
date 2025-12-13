import { Request, Response, NextFunction } from 'express';
import { CreateProductDto, UpdateProductDto } from '../dtos/ProductDto';

/**
 * Validation Middleware for Product Requests
 */
export class ProductValidator {
  /**
   * Validate create product request
   */
  static validateCreateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { name, description, price, stock } = req.body as CreateProductDto;

    const errors: string[] = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }

    if (description === undefined || typeof description !== 'string') {
      errors.push('Description is required and must be a string');
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
      errors.push('Price is required and must be a non-negative number');
    }

    if (
      stock === undefined ||
      typeof stock !== 'number' ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      errors.push('Stock is required and must be a non-negative integer');
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    next();
  }

  /**
   * Validate update product request
   */
  static validateUpdateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { name, description, price, stock } = req.body as UpdateProductDto;

    const errors: string[] = [];

    // All fields are optional for update, but if provided, must be valid
    if (
      name !== undefined &&
      (typeof name !== 'string' || name.trim().length === 0)
    ) {
      errors.push('Name must be a non-empty string if provided');
    }

    if (description !== undefined && typeof description !== 'string') {
      errors.push('Description must be a string if provided');
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      errors.push('Price must be a non-negative number if provided');
    }

    if (
      stock !== undefined &&
      (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))
    ) {
      errors.push('Stock must be a non-negative integer if provided');
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    next();
  }

  /**
   * Validate product ID parameter
   */
  static validateProductId(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid product ID',
      });
      return;
    }

    next();
  }
}
