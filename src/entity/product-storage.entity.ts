import { BaseEntity } from './base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BannerProduct } from './banner-product.entity';

@Entity()
export class ProductStorage extends BaseEntity {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  asin!: string;

  @OneToMany(() => BannerProduct, bannerProduct => bannerProduct.productStorage, {
    onDelete: 'CASCADE',
  })
  bannerProducts!: BannerProduct[];
}
