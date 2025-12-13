import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductValidator } from '../middlewares/validation';

/**
 * Product Routes
 *
 * Defines all routes for product operations.
 */
export class ProductRoutes {
  private router: Router;

  constructor(private readonly productController: ProductController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create product
    this.router.post(
      '/',
      ProductValidator.validateCreateProduct,
      this.productController.createProduct
    );

    // Get all products
    this.router.get('/', this.productController.getAllProducts);

    // Get product by ID
    this.router.get(
      '/:id',
      ProductValidator.validateProductId,
      this.productController.getProductById
    );

    // Update product
    this.router.put(
      '/:id',
      ProductValidator.validateProductId,
      ProductValidator.validateUpdateProduct,
      this.productController.updateProduct
    );

    // Delete product
    this.router.delete(
      '/:id',
      ProductValidator.validateProductId,
      this.productController.deleteProduct
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
