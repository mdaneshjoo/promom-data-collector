import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

export class SuperCategoryDesignationMappingItem {
  id!: number;
  order?: number;
}
@Entity()
export class ProductSuperCategoryDesignationMapping extends BaseEntity {
  @Column({ type: 'int' })
  stage!: number;

  @Column({ type: 'int' })
  state!: number;

  @Column({ type: 'int' })
  period!: number;

  @Column({ type: 'int' })
  condition!: number;

  @Column({ type: 'jsonb' })
  superCategories!: SuperCategoryDesignationMappingItem[];
}
