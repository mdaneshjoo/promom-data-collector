import { BaseEntity } from './base.entity';
import { Column, Entity,  ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ProductCategory } from './product-category.entity';

@Entity()
export class WishListItem extends BaseEntity {
  @Column({ type: 'varchar' })
  asin!: string;

  // @Column({ type: 'varchar' })
  // title!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, user => user.wishlistItem)
  user!: User;

  @Column()
  categoryId!: number;

  @ManyToOne(() => ProductCategory, category => category.wishlistItems, {
    onDelete: 'CASCADE',
  })
  category!: ProductCategory;
}
