import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Banner } from './banner.entity';
import { ProductCategory } from './product-category.entity';

@Entity()
export class BannerProductCategory extends BaseEntity {
  @Column()
  productCategoryId!: number;

  @ManyToOne(() => ProductCategory, productCategory => productCategory.bannerProductCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productCategory!: ProductCategory;

  @Column()
  bannerId!: number;

  @ManyToOne(() => Banner, banner => banner.bannerProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  banner!: Banner;
}
