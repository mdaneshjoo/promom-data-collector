import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BannerBellySafe } from './banner-belly-safe.entity';

export class BellySafeSourcesWithReference {
  source!: string;
  reference!: string;
}

@Entity()
export class BellySafeHistory extends BaseEntity {
  @Column({ type: 'text' })
  question!: string;

  @Column({ type: 'varchar' })
  food!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, user => user.bellySafeHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Partial<User>;

  @Column()
  bannerBellySafeId!: number;

  @ManyToOne(() => BannerBellySafe, bannerBellySafe => bannerBellySafe.bellySafeHistories)
  bannerBellySafe!: BannerBellySafe;
}
