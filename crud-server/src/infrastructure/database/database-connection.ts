import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';

/**
 * Database Configuration and Initialization
 *
 * Sets up TypeORM DataSource with SQLite database connection.
 */
export class DatabaseConnection {
  private static dataSource: DataSource;

  private constructor() {}

  /**
   * Get or create DataSource instance (Singleton pattern)
   */
  static async getDataSource(): Promise<DataSource> {
    if (!DatabaseConnection.dataSource) {
      const dbPath = process.env.DATABASE_PATH || './database.sqlite';

      DatabaseConnection.dataSource = new DataSource({
        type: 'sqlite',
        database: dbPath,
        entities: [Product],
        synchronize: true, // Auto-create tables (disable in production)
        logging: false,
      });

      await DatabaseConnection.dataSource.initialize();
      console.log('Database connection established');
      console.log('Database tables synchronized');
    }

    return DatabaseConnection.dataSource;
  }

  /**
   * Get existing DataSource (throws if not initialized)
   */
  static getExistingDataSource(): DataSource {
    if (
      !DatabaseConnection.dataSource ||
      !DatabaseConnection.dataSource.isInitialized
    ) {
      throw new Error(
        'DataSource not initialized. Call getDataSource() first.'
      );
    }
    return DatabaseConnection.dataSource;
  }

  /**
   * Close database connection
   */
  static async close(): Promise<void> {
    if (
      DatabaseConnection.dataSource &&
      DatabaseConnection.dataSource.isInitialized
    ) {
      await DatabaseConnection.dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}
