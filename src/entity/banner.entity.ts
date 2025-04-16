import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BannerDesignation } from './banner-designation.entity';
import { BannerBellySafe } from './banner-belly-safe.entity';
import { BannerProduct } from './banner-product.entity';
import { BannerQuestionsAndAnswers } from './banner-questions-and-answers.entity';

@Entity()
export class Banner extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @OneToMany(() => BannerDesignation, bannerDesignation => bannerDesignation.banner, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  bannerDesignation!: BannerDesignation[];


  @OneToOne(() => BannerBellySafe, bannerBellySafe => bannerBellySafe.banner, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  bannerBellySafe!: BannerBellySafe;

  @OneToMany(() => BannerProduct, bannerProduct => bannerProduct.banner, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  bannerProducts!: BannerProduct[];


  @OneToOne(
    () => BannerQuestionsAndAnswers,
    bannerQuestionsAndAnswers => bannerQuestionsAndAnswers.banner,
    {
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  bannerQuestionsAndAnswer!: BannerQuestionsAndAnswers;
}
