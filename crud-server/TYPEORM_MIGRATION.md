# TypeORM Migration Guide

## Summary of Changes

The application has been successfully refactored from **better-sqlite3** to **TypeORM**. This change provides:

✅ **Better abstraction** - ORM handles SQL generation
✅ **Type safety** - Full TypeScript integration with decorators
✅ **Easier migrations** - Built-in schema synchronization
✅ **More features** - Relations, transactions, query builder
✅ **Better scalability** - Easy to switch to PostgreSQL/MySQL

---

## What Changed

### 1. Dependencies

**Removed:**

- `better-sqlite3` - Raw SQLite driver
- `@types/better-sqlite3` - Type definitions

**Added:**

- `typeorm` - TypeScript ORM
- `reflect-metadata` - Required for decorators
- `sqlite3` - SQLite driver for TypeORM

### 2. Configuration Files

**`package.json`**

- Updated dependencies
- Scripts remain the same

**`crud-server/tsconfig.json`**

- Added `experimentalDecorators: true`
- Added `emitDecoratorMetadata: true`
- Added `strictPropertyInitialization: false`

### 3. Domain Layer Changes

**`src/domain/entities/Product.ts`**

**Before (Plain TypeScript):**

```typescript
export class Product {
  constructor(
    public readonly id: number | null,
    public readonly name: string
  ) // ... other fields
  {}
}
```

**After (TypeORM Entity):**

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  // ... other decorated fields
}
```

**Key Changes:**

- Added TypeORM decorators (`@Entity`, `@Column`, etc.)
- Changed from constructor-based to decorator-based
- Added `@BeforeInsert` and `@BeforeUpdate` for validation
- Removed `fromPersistence()` method (TypeORM handles this)
- Simplified `create()` factory method

### 4. Infrastructure Layer Changes

**`src/infrastructure/database/DatabaseConnection.ts`**

**Before (better-sqlite3):**

```typescript
import Database from 'better-sqlite3';

export class DatabaseConnection {
  private static instance: Database.Database;

  static getInstance(): Database.Database {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new Database(dbPath);
      DatabaseConnection.initializeTables();
    }
    return DatabaseConnection.instance;
  }
}
```

**After (TypeORM):**

```typescript
import { DataSource } from 'typeorm';

export class DatabaseConnection {
  private static dataSource: DataSource;

  static async getDataSource(): Promise<DataSource> {
    if (!DatabaseConnection.dataSource) {
      DatabaseConnection.dataSource = new DataSource({
        type: 'sqlite',
        database: dbPath,
        entities: [Product],
        synchronize: true,
      });
      await DatabaseConnection.dataSource.initialize();
    }
    return DatabaseConnection.dataSource;
  }
}
```

**Key Changes:**

- Async initialization (TypeORM requires async)
- No manual table creation (handled by `synchronize: true`)
- DataSource instead of raw Database instance
- Added `getExistingDataSource()` for non-async access

**`src/infrastructure/repositories/SqliteProductRepository.ts`**

**Renamed to:** `TypeOrmProductRepository`

**Before (Raw SQL):**

```typescript
export class SqliteProductRepository implements ProductRepository {
  private db: Database.Database;

  async create(product: Product): Promise<Product> {
    const stmt = this.db.prepare(`INSERT INTO products ...`);
    const result = stmt.run(...);
    return Product.fromPersistence(...);
  }
}
```

**After (TypeORM):**

```typescript
export class TypeOrmProductRepository implements ProductRepository {
  private repository: Repository<Product>;

  async create(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }
}
```

**Key Changes:**

- No more raw SQL queries
- Uses TypeORM Repository pattern
- Much simpler code
- Automatic type mapping

### 5. Application Layer Changes

**`src/application/services/ProductService.ts`**

**Minor change in `updateProduct()`:**

**Before:**

```typescript
const updatedProduct = existingProduct.update(name, description, price, stock);
return await this.productRepository.update(updatedProduct);
```

**After:**

```typescript
if (name !== undefined) existingProduct.name = name;
if (description !== undefined) existingProduct.description = description;
if (price !== undefined) existingProduct.price = price;
if (stock !== undefined) existingProduct.stock = stock;

return await this.productRepository.update(existingProduct);
```

**Reason:** TypeORM entities are mutable, so we update properties directly.

### 6. Entry Point Changes

**`src/index.ts`**

**Before (Synchronous):**

```typescript
DatabaseConnection.getInstance();
const app = new App();
app.listen();
```

**After (Async):**

```typescript
async function bootstrap() {
  await DatabaseConnection.getDataSource();
  const app = new App();
  app.listen();
}
bootstrap();
```

**Reason:** TypeORM initialization is async.

**`src/app.ts`**

- Added `import 'reflect-metadata'` at the top
- Changed `SqliteProductRepository` to `TypeOrmProductRepository`

---

## Benefits of TypeORM

### 1. **Less Boilerplate Code**

**Before (Raw SQL):**

```typescript
const stmt = this.db.prepare(`
  INSERT INTO products (name, description, price, stock, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const result = stmt.run(product.name, product.description, ...);
```

**After (TypeORM):**

```typescript
return await this.repository.save(product);
```

### 2. **Automatic Type Safety**

TypeORM validates types at runtime and compile time.

### 3. **No Manual Schema Management**

With `synchronize: true`, TypeORM automatically creates/updates tables based on entities.

### 4. **Easy Database Switching**

To switch to PostgreSQL:

```typescript
new DataSource({
  type: 'postgres', // Just change this!
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  entities: [Product],
});
```

### 5. **Advanced Features Available**

- Relations (One-to-Many, Many-to-Many)
- Transactions
- Query Builder
- Migrations
- Connection pooling

---

## Migration Steps (If You Need to Do This Again)

### Step 1: Update Dependencies

```bash
npm uninstall better-sqlite3 @types/better-sqlite3
npm install typeorm reflect-metadata sqlite3
```

### Step 2: Update tsconfig.json

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false
  }
}
```

### Step 3: Convert Entity to TypeORM

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
```

### Step 4: Create DataSource

```typescript
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'sqlite',
  database: './database.sqlite',
  entities: [Product],
  synchronize: true,
});

await dataSource.initialize();
```

### Step 5: Use Repository

```typescript
const repository = dataSource.getRepository(Product);
const product = await repository.save(newProduct);
const products = await repository.find();
```

---

## TypeORM Entity Decorators Reference

### Entity Decorators

- `@Entity()` - Marks class as database entity
- `@Entity('table_name')` - Specify custom table name

### Column Decorators

- `@PrimaryGeneratedColumn()` - Auto-increment primary key
- `@Column()` - Regular column
- `@Column({ type: 'varchar', length: 255 })` - With options
- `@CreateDateColumn()` - Auto-set on insert
- `@UpdateDateColumn()` - Auto-update on save

### Lifecycle Hooks

- `@BeforeInsert()` - Run before insert
- `@BeforeUpdate()` - Run before update
- `@AfterLoad()` - Run after loading from DB

---

## Performance Considerations

### TypeORM vs Raw SQL

**TypeORM Advantages:**

- Developer productivity (less code)
- Type safety
- Maintainability

**Raw SQL Advantages:**

- Slightly better performance (minimal)
- Full control over queries

**Verdict:** For most applications, TypeORM's benefits far outweigh the minimal performance difference.

---

## Common TypeORM Patterns

### 1. Create and Save

```typescript
const product = Product.create('Laptop', 'Gaming laptop', 1299, 5);
await repository.save(product);
```

### 2. Find Operations

```typescript
// Find all
const products = await repository.find();

// Find one by ID
const product = await repository.findOne({ where: { id: 1 } });

// Find with conditions
const products = await repository.find({
  where: { price: MoreThan(1000) },
  order: { createdAt: 'DESC' },
  take: 10,
});
```

### 3. Update

```typescript
const product = await repository.findOne({ where: { id: 1 } });
product.name = 'Updated Name';
await repository.save(product);
```

### 4. Delete

```typescript
await repository.delete(1);
// or
await repository.remove(product);
```

### 5. Transactions

```typescript
await dataSource.transaction(async (manager) => {
  await manager.save(product1);
  await manager.save(product2);
});
```

---

## Testing with TypeORM

### In-Memory SQLite for Tests

```typescript
const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [Product],
  synchronize: true,
});
```

### Mock Repository

```typescript
const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};
```

---

## Production Considerations

### 1. Disable synchronize

```typescript
new DataSource({
  synchronize: false, // Use migrations instead!
});
```

### 2. Use Migrations

```bash
npm install -g typeorm
typeorm migration:generate -n CreateProducts
typeorm migration:run
```

### 3. Connection Pooling (for PostgreSQL/MySQL)

```typescript
new DataSource({
  type: 'postgres',
  poolSize: 10,
});
```

---

## Troubleshooting

### Issue: "Cannot use import statement outside a module"

**Solution:** Ensure `reflect-metadata` is imported at the top of entry file.

### Issue: "EntityMetadataNotFoundError"

**Solution:** Make sure entity is registered in DataSource:

```typescript
new DataSource({
  entities: [Product], // Add here!
});
```

### Issue: Validation not working

**Solution:** Ensure `@BeforeInsert()` and `@BeforeUpdate()` decorators are on validation method.

---

## Next Steps

### Recommended Enhancements

1. **Add Migrations**

   - Disable `synchronize`
   - Use TypeORM migrations for production

2. **Add Relations**

   - Categories for products
   - User ownership

3. **Use Query Builder**

   - Complex queries
   - Better performance

4. **Add Caching**

   - TypeORM supports query result caching

5. **Switch to PostgreSQL**
   - For production deployment
   - Better performance at scale

---

## Conclusion

The migration to TypeORM provides:

- ✅ Cleaner, more maintainable code
- ✅ Better type safety
- ✅ Easier database management
- ✅ More features out of the box
- ✅ Better scalability

The hexagonal architecture still intact - we just swapped the adapter!

---

## Quick Reference

**Start Server:**

```bash
npm run dev
```

**Test API:**

```bash
# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"Gaming","price":1299,"stock":5}'

# Get all
curl http://localhost:3000/api/products

# Get by ID
curl http://localhost:3000/api/products/1

# Update
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete
curl -X DELETE http://localhost:3000/api/products/1
```

**Everything still works exactly the same from the API perspective!**
