# Interview Tips - Hexagonal Architecture CRUD API

## Key Points to Emphasize During Interview

### 1. Architecture Choice Rationale

**When asked "Why Hexagonal Architecture?"**

✅ **Say**:

- "I chose Hexagonal Architecture because it provides clear separation of concerns"
- "The business logic is completely independent of frameworks and databases"
- "It makes the code highly testable - I can test business logic without a database"
- "Easy to swap implementations - for example, moving from SQLite to PostgreSQL"
- "Follows SOLID principles, especially Dependency Inversion"

### 2. Layer Explanation

**Domain Layer (Core)**

- "This is the heart of the application - pure business logic"
- "Contains entities with validation rules"
- "Defines interfaces (ports) that outer layers must implement"
- "Zero dependencies on external frameworks"

**Application Layer**

- "Orchestrates use cases and business workflows"
- "Calls domain entities and uses repository interfaces"
- "Framework-agnostic - doesn't know about HTTP or databases"

**Infrastructure Layer**

- "Contains all the technical implementations"
- "SQLite repository implements the domain's repository interface"
- "This is where I can easily swap databases"

**Presentation Layer**

- "Handles HTTP concerns - routes, validation, error handling"
- "Controllers call application services"
- "DTOs ensure type safety for requests/responses"

### 3. Design Patterns Used

Point out these patterns during the interview:

1. **Repository Pattern**

   - Abstracts data access
   - Interface in domain, implementation in infrastructure

2. **Dependency Injection**

   - Manual DI in `app.ts`
   - Controllers receive services, services receive repositories

3. **Factory Pattern**

   - `Product.create()` for new products
   - `Product.fromPersistence()` for reconstructing from DB

4. **Singleton Pattern**

   - `DatabaseConnection.getInstance()`

5. **DTO Pattern**
   - Separate request/response objects from domain entities

### 4. Code Quality Features

Highlight these aspects:

✅ **Type Safety**

- Full TypeScript with strict mode
- Interfaces for all contracts
- DTOs for all API interactions

✅ **Error Handling**

- Centralized error handler middleware
- Validation at presentation layer
- Business rule validation in domain

✅ **Validation**

- Input validation middleware
- Domain entity validation
- Type checking

✅ **Separation of Concerns**

- Each class has single responsibility
- Clear boundaries between layers

### 5. Potential Improvements (if asked)

**"What would you add with more time?"**

1. **Testing**

   - Unit tests for domain entities
   - Service tests with mock repositories
   - Integration tests for API endpoints
   - Example: "I'd use Jest with mock implementations"

2. **API Documentation**

   - Swagger/OpenAPI specification
   - "Makes it easy for frontend developers to integrate"

3. **Logging**

   - Structured logging with Winston or Pino
   - Request/response logging
   - Error tracking

4. **Authentication & Authorization**

   - JWT middleware
   - Role-based access control
   - "Would add this as another middleware"

5. **Database Migrations**

   - Version-controlled schema changes
   - Tools like knex.js or TypeORM migrations

6. **Pagination**

   - For `GET /products` endpoint
   - Query parameters: `?page=1&limit=10`

7. **Search & Filtering**

   - Filter by price range, stock status
   - Full-text search on name/description

8. **Caching**

   - Redis for frequently accessed products
   - "Would implement as another adapter"

9. **CI/CD Pipeline**

   - GitHub Actions for testing
   - Docker containerization
   - Automated deployment

10. **Environment Configuration**
    - Better config management
    - Different configs for dev/staging/prod

### 6. How to Demo During Interview

**Step 1: Explain Architecture**

- Start with the diagram in `ARCHITECTURE.md`
- Walk through the dependency flow

**Step 2: Code Walkthrough**

- Show domain entities first (pure business logic)
- Show repository interface (port)
- Show repository implementation (adapter)
- Show service orchestration
- Show controller HTTP handling

**Step 3: Live Demo**

```bash
# Start server
npm run dev

# In another terminal, run tests
./crud-server/test-api.sh
```

**Step 4: Highlight Key Files**

- `Product.ts` - "Notice the validation logic"
- `ProductRepository.ts` - "This is the port"
- `SqliteProductRepository.ts` - "This is the adapter"
- `ProductService.ts` - "Business logic orchestration"
- `ProductController.ts` - "HTTP handling only"

### 7. Common Interview Questions & Answers

**Q: How would you change from SQLite to PostgreSQL?**
A: "I'd create a new `PostgresProductRepository` implementing the same `ProductRepository` interface. Then just swap it in `app.ts`. No changes to business logic needed."

**Q: How do you handle errors?**
A: "Three levels:

1. Domain validation throws errors for business rules
2. Services catch and handle domain errors
3. Express middleware catches all errors and formats responses"

**Q: How would you test this?**
A: "Domain entities: pure unit tests. Services: test with mock repositories. Controllers: integration tests with test database. The architecture makes each layer independently testable."

**Q: Why not use an ORM like TypeORM or Prisma?**
A: "ORMs are great, but they can couple you to specific patterns. With this approach, I control exactly how data is stored and retrieved. However, I could easily add an ORM in the infrastructure layer if needed."

**Q: How would you add authentication?**
A: "I'd add a JWT middleware in the presentation layer. I might also add a User entity in the domain and a UserRepository. The hexagonal architecture makes it easy to add these features."

**Q: What about transactions?**
A: "I'd add transaction support in the repository layer. The service layer would call a method like `repository.transaction()` to wrap operations."

### 8. Technical Deep Dives

Be prepared to discuss:

**TypeScript Benefits**

- Type safety catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code with interfaces

**SQLite Choice**

- Lightweight, no separate server needed
- Perfect for demos and development
- Easy to switch to production DB

**Express Framework**

- Industry standard, well understood
- Middleware pattern for cross-cutting concerns
- Large ecosystem

**better-sqlite3 vs node-sqlite3**

- Synchronous API, simpler code
- Better performance
- More reliable

### 9. What NOT to Say

❌ "I just followed a tutorial"
❌ "I'm not sure why I structured it this way"
❌ "This is overkill for a simple CRUD app"
❌ "I don't know how to test this"

### 10. Confidence Boosters

✅ "I can extend this easily"
✅ "The architecture supports future requirements"
✅ "Each layer has clear responsibilities"
✅ "It follows industry best practices"
✅ "I can test each component independently"

## Final Tips

1. **Practice explaining the architecture** - Use the diagram
2. **Know your code** - Be able to navigate quickly
3. **Show testing knowledge** - Even if tests aren't written
4. **Discuss trade-offs** - Every decision has pros/cons
5. **Be honest** - If you don't know something, say you'd research it
6. **Show enthusiasm** - Talk about what you learned building this

## Questions to Ask Interviewer

Good questions to show engagement:

1. "What's your team's approach to architecture patterns?"
2. "How do you handle testing in your current stack?"
3. "What database technologies do you use?"
4. "How does your team handle API versioning?"
5. "What's your deployment process like?"

Good luck with your interview! 🚀
