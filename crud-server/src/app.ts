import 'reflect-metadata';
import express = require('express');
import { Application } from 'express';
import { ProductRoutes } from './presentation/routes/product.routes';
import { ProductController } from './presentation/controllers/product.controller';
import { ProductService } from './service/product.service';
import { errorHandler } from './presentation/middlewares/error-handler';
import { DataSource } from 'typeorm';
import { Product } from './domain/entities/product.entity';
import { SQLiteTypeOrmProductRepository } from './infrastructure/sqlite-repositories/product.sqlite.repository';

/**
 * App Configuration
 *
 * Sets up the Express application with all dependencies.
 * This is where dependency injection happens.
 */
export class App {
  private app: Application;
  private port: number;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Body parser middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS middleware (simple implementation)
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  private initializeRoutes(): void {
    // Dependency Injection: Manual wiring of dependencies
    // In a larger application, might need to use a DI container
    const productRepository = new SQLiteTypeOrmProductRepository(
      this.dataSource
    );
    const productService = new ProductService(productRepository);
    const productController = new ProductController(productService);
    const productRoutes = new ProductRoutes(productController);

    // Register routes
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    this.app.use('/api/products', productRoutes.getRouter());

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
      console.log(`Health check: http://localhost:${this.port}/health`);
      console.log(`Products API: http://localhost:${this.port}/api/products`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
