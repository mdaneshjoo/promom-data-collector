import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Banner } from './banner.entity';
import { BellySafeHistory } from './belly-safe-history.entity';

@Entity()
export class BannerBellySafe extends BaseEntity {
  @Column()
  bannerId!: number;

  @OneToOne(() => Banner, banner => banner.bannerBellySafe, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  banner!: Banner;

  @OneToMany(() => BellySafeHistory, bellySafeHistory => bellySafeHistory.bannerBellySafe)
  bellySafeHistories!: BellySafeHistory[];
}
