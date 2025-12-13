# Hexagonal Architecture - Product CRUD API

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                       │
│                         (Input Adapters)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Express    │      │ Middlewares  │      │     DTOs     │  │
│  │   Routes     │─────▶│ Validation   │      │  (Request/   │  │
│  │              │      │ Error Handle │      │   Response)  │  │
│  └──────┬───────┘      └──────────────┘      └──────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐                                               │
│  │ Controllers  │                                               │
│  │  (HTTP I/O)  │                                               │
│  └──────┬───────┘                                               │
└─────────┼───────────────────────────────────────────────────────┘
          │
          │ Uses
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                         │
│                         (Business Logic)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │           ProductService (Use Cases)                 │       │
│  │                                                      │       │
│  │  - createProduct()                                  │       │
│  │  - getProductById()                                 │       │
│  │  - getAllProducts()                                 │       │
│  │  - updateProduct()                                  │       │
│  │  - deleteProduct()                                  │       │
│  └─────────────────┬────────────────────────────────────┘       │
└────────────────────┼──────────────────────────────────────────────┘
                     │
                     │ Depends on (Interface)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DOMAIN LAYER                            │
│                        (Core Business)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐          ┌──────────────────────────┐         │
│  │   Product    │          │  ProductRepository       │         │
│  │   Entity     │          │     (Interface/Port)     │         │
│  │              │          │                          │         │
│  │  - id        │          │  - create()              │         │
│  │  - name      │          │  - findById()            │         │
│  │  - price     │          │  - findAll()             │         │
│  │  - stock     │          │  - update()              │         │
│  │  - validate()│          │  - delete()              │         │
│  └──────────────┘          └────────────▲─────────────┘         │
│                                         │                        │
└─────────────────────────────────────────┼────────────────────────┘
                                          │
                                          │ Implements
                                          │
┌─────────────────────────────────────────┼────────────────────────┐
│                     INFRASTRUCTURE LAYER │                       │
│                      (Output Adapters)   │                       │
├──────────────────────────────────────────┼───────────────────────┤
│                                          │                        │
│  ┌───────────────────────────────────────┴───────────┐           │
│  │      SqliteProductRepository (Adapter)            │           │
│  │                                                    │           │
│  │  Implements ProductRepository Interface           │           │
│  │  - Database operations using better-sqlite3       │           │
│  └────────────────────────┬───────────────────────────┘           │
│                           │                                       │
│                           ▼                                       │
│  ┌──────────────────────────────────────────────────┐            │
│  │      DatabaseConnection (Singleton)              │            │
│  │                                                  │            │
│  │  - SQLite database instance                     │            │
│  │  - Table initialization                         │            │
│  └──────────────────────────────────────────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Domain Layer (Core)

**Location**: `src/domain/`

- **Entities**: Pure business objects with validation logic
  - `Product.ts`: Product entity with business rules
- **Repository Interfaces**: Contracts for data persistence (Ports)
  - `ProductRepository.ts`: Interface defining persistence operations

**Key Characteristics**:

- ✅ No external dependencies
- ✅ Pure TypeScript/JavaScript
- ✅ Framework-agnostic
- ✅ Contains business validation

### 2. Application Layer (Use Cases)

**Location**: `src/application/`

- **Services**: Orchestrate business logic and use cases
  - `ProductService.ts`: Implements product business operations

**Key Characteristics**:

- ✅ Depends only on domain layer
- ✅ Implements business workflows
- ✅ Technology-agnostic
- ✅ Testable with mocks

### 3. Infrastructure Layer (Adapters)

**Location**: `src/infrastructure/`

- **Database**: Connection and configuration
  - `DatabaseConnection.ts`: SQLite setup
- **Repositories**: Concrete implementations
  - `SqliteProductRepository.ts`: SQLite implementation of ProductRepository

**Key Characteristics**:

- ✅ Implements domain interfaces
- ✅ Framework-specific code
- ✅ Easy to swap (SQLite → PostgreSQL)
- ✅ Isolated from business logic

### 4. Presentation Layer (HTTP)

**Location**: `src/presentation/`

- **Controllers**: Handle HTTP requests/responses
  - `ProductController.ts`: HTTP handlers for products
- **Routes**: Define API endpoints
  - `productRoutes.ts`: Route definitions
- **Middlewares**: Request processing
  - `validation.ts`: Input validation
  - `errorHandler.ts`: Error handling
- **DTOs**: Data transfer objects
  - `ProductDto.ts`: Request/response schemas

**Key Characteristics**:

- ✅ Framework-specific (Express)
- ✅ Handles HTTP concerns
- ✅ Maps DTOs to domain entities
- ✅ User-facing layer

## Dependency Flow

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑            ↑
  Express      Use Cases    Entities    Repositories
   Routes      Services     Interfaces   (SQLite)
```

**Important**: Dependencies point INWARD

- Infrastructure depends on Domain (implements interfaces)
- Application depends on Domain (uses entities and interfaces)
- Presentation depends on Application (calls services)

## Benefits of This Architecture

### 1. **Testability**

- Mock repositories easily
- Test business logic in isolation
- No database required for unit tests

### 2. **Flexibility**

- Swap SQLite for PostgreSQL/MongoDB
- Change from Express to Fastify
- Add GraphQL alongside REST

### 3. **Maintainability**

- Clear separation of concerns
- Easy to locate code
- Changes isolated to specific layers

### 4. **Scalability**

- Add new features without touching existing code
- Multiple implementations of same interface
- Easy to add new adapters

## Example Request Flow

1. **HTTP Request** → `POST /api/products`
2. **Route** → `productRoutes.ts` matches route
3. **Middleware** → `validation.ts` validates input
4. **Controller** → `ProductController.createProduct()`
5. **Service** → `ProductService.createProduct()`
6. **Domain** → `Product.create()` validates business rules
7. **Repository** → `SqliteProductRepository.create()` saves to DB
8. **Response** ← Returns through the layers
9. **HTTP Response** ← JSON response to client

## Testing Strategy

### Unit Tests

- **Domain Layer**: Test entity validation
- **Application Layer**: Test business logic with mock repositories
- **Infrastructure Layer**: Test repository with in-memory DB

### Integration Tests

- Test full request flow
- Use test database
- Verify all layers work together

### Example Test Structure

```typescript
// Mock repository for testing
class MockProductRepository implements ProductRepository {
  private products: Product[] = [];

  async create(product: Product): Promise<Product> {
    // Mock implementation
  }
  // ... other methods
}

// Test service with mock
const mockRepo = new MockProductRepository();
const service = new ProductService(mockRepo);
// Test service methods
```
