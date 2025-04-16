import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ProductCategoryDesignationMapping extends BaseEntity {
  @Column({ type: 'int' })
  stage!: number;

  @Column({ type: 'int' })
  state!: number;

  @Column({ type: 'int' })
  period!: number;

  @Column({ type: 'int' })
  condition!: number;

  @Column({ type: 'smallint', array: true })
  CategoryIds!: number[];
}
