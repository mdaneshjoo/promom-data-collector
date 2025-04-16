import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ProductSuperCategory extends BaseEntity {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar', nullable: true })
  subTitle?: string;
}
