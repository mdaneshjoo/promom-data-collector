import { BaseEntity } from './base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductCategoryItem } from './product-category-item.entity';

@Entity()
export class Product extends BaseEntity {
  @Column({ type: 'varchar' })
  asin!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column()
  categoryId!: number;

  @ManyToOne(() => ProductCategory, category => category.products, {
    onDelete: 'CASCADE',
  })
  category!: ProductCategory;

  @Column()
  categoryItemId!: number;

  @ManyToOne(() => ProductCategoryItem, categoryItem => categoryItem.products, {
    onDelete: 'CASCADE',
  })
  categoryItem!: ProductCategoryItem;
}
