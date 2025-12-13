import 'reflect-metadata';
import { App } from './app';
import { DatabaseConnection } from './infrastructure/database/DatabaseConnection';

/**
 * Application Entry Point
 */

async function bootstrap() {
  try {
    // Initialize TypeORM database connection
    await DatabaseConnection.getDataSource();

    // Create and start the application
    const app = new App();
    app.listen();

    // Graceful shutdown handlers
    const shutdown = async () => {
      console.log('\nShutting down gracefully...');
      await DatabaseConnection.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Properly handle the bootstrap promise
bootstrap().catch((error) => {
  console.error('Unhandled error during bootstrap:', error);
  process.exit(1);
});
