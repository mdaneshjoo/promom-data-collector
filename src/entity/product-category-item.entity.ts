import { BaseEntity } from './base.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { Product } from './product.entity';

@Entity()
export class ProductCategoryItem extends BaseEntity {
  @ManyToOne(() => ProductCategory, category => category.items, {
    onDelete: 'CASCADE',
  })
  category!: ProductCategory;

  @OneToMany(() => Product, product => product.categoryItem, {
    cascade: true,
  })
  products!: Product[];
}
