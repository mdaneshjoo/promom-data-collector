import { BaseEntity } from './base.entity';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Banner } from './banner.entity';
import { BannerQuestionsAndAnswersResult } from './banner-questions-and-answers-result.entity';

@Entity()
@Index('unique_banner_qa', ['banner'], {
  unique: true,
  where: ' "deletedAt" IS NULL',
})
export class BannerQuestionsAndAnswers extends BaseEntity {
  @Column({ type: 'text' })
  prompt!: string;

  @Column()
  bannerId!: number;

  @OneToOne(() => Banner, banner => banner.bannerQuestionsAndAnswer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  banner!: Banner;

  @OneToMany(
    () => BannerQuestionsAndAnswersResult,
    bannerQuestionsAndAnswersResult => bannerQuestionsAndAnswersResult.bannerQuestionsAndAnswers,
    {
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  bannerQuestionsAndAnswersResults!: BannerQuestionsAndAnswersResult[];
}
