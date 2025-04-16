import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Banner } from './banner.entity';
import { ProductStorage } from './product-storage.entity';

@Entity()
export class BannerProduct extends BaseEntity {
  @Column()
  productStorageId!: number;

  @ManyToOne(() => ProductStorage, productStorage => productStorage.bannerProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productStorage!: ProductStorage;

  @Column()
  bannerId!: number;

  @ManyToOne(() => Banner, banner => banner.bannerProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  banner!: Banner;
}
