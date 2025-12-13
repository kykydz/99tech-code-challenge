# Product CRUD API - Hexagonal Architecture

A RESTful API for product management built with Express, TypeScript, TypeORM, SQLite, and Hexagonal Architecture (Ports & Adapters pattern).

## Architecture

This project follows Hexagonal Architecture principles:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and business rules
- **Infrastructure Layer**: External adapters (database, etc.)
- **Presentation Layer**: HTTP controllers and routes

## Project Structure

```
src/
├── domain/              # Core business logic
│   ├── entities/        # Domain entities
│   └── repositories/    # Repository interfaces (ports)
├── application/         # Use cases
│   └── services/        # Application services
├── infrastructure/      # External adapters
│   ├── database/        # Database configuration
│   └── repositories/    # Repository implementations
├── presentation/        # HTTP layer
│   ├── controllers/     # Request handlers
│   ├── routes/          # Route definitions
│   ├── middlewares/     # Express middlewares
│   └── dtos/           # Data transfer objects
└── index.ts            # Application entry point
```

## API Endpoints

### Products

- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Request Examples

### Create Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 10
  }'
```

### Get All Products

```bash
curl http://localhost:3000/api/products
```

### Get Product by ID

```bash
curl http://localhost:3000/api/products/1
```

### Update Product

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1499.99,
    "stock": 5
  }'
```

### Delete Product

```bash
curl -X DELETE http://localhost:3000/api/products/1
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Run the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Building for Production

```bash
npm run build
npm start
```

## Key Benefits of This Architecture

1. **Testability**: Business logic is independent of frameworks and databases
2. **Flexibility**: Easy to swap implementations (e.g., SQLite → PostgreSQL)
3. **Maintainability**: Clear separation of concerns
4. **Scalability**: Easy to add new features without affecting existing code
