import { BaseEntity } from './base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductCategoryItem } from './product-category-item.entity';
import { Product } from './product.entity';
import { WishListItem } from './wishlist-item.entity';
import { BannerProductCategory } from './banner-product-category.entity';

export class ImageUrl {
  jpg?: string;
  png?: string;
  svg?: string;
  ico?: string;
  webp?: string;
}
@Entity()
export class ProductCategory extends BaseEntity {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar', nullable: true })
  subTitle?: string;

  @OneToMany(() => ProductCategoryItem, categoryItem => categoryItem.category, { cascade: true })
  items!: ProductCategoryItem[];

  @OneToMany(() => Product, product => product.category, { cascade: true })
  products!: Product[];

  @OneToMany(() => WishListItem, wishlistItem => wishlistItem.category, {
    cascade: true,
  })
  wishlistItems!: WishListItem[];

  @OneToMany(
    () => BannerProductCategory,
    bannerProductCategory => bannerProductCategory.productCategory,
    {
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  bannerProductCategories!: BannerProductCategory[];
}
