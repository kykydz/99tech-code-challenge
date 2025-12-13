import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

/**
 * Product Entity - Core Domain Model
 *
 * Represents a product in the business domain.
 * Uses TypeORM decorators for ORM mapping while keeping business logic.
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'integer' })
  stock!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Validation hook - runs before insert
   */
  @BeforeInsert()
  @BeforeUpdate()
  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (this.name.length > 255) {
      throw new Error('Product name must not exceed 255 characters');
    }

    if (this.price < 0) {
      throw new Error('Product price must be greater than or equal to 0');
    }

    if (this.stock < 0) {
      throw new Error('Product stock must be greater than or equal to 0');
    }
  }

  /**
   * Factory method to create a new product (without ID)
   */
  static create(
    name: string,
    description: string,
    price: number,
    stock: number
  ): Product {
    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    return product;
  }
}
