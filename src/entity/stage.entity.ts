import { BannerDesignation } from './banner-designation.entity';
import { BannerQuestionsAndAnswersResult } from './banner-questions-and-answers-result.entity';
import { BaseEntity } from './base.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class QuestionnaireStage extends BaseEntity {
  @OneToMany(() => BannerDesignation, bannerDesignation => bannerDesignation.stage, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  bannerDesignation!: BannerDesignation[];

  @OneToMany(
    () => BannerQuestionsAndAnswersResult,
    bannerQuestionsAndAnswersResult => bannerQuestionsAndAnswersResult.stage,
  )
  bannerQuestionsAndAnswersResults!: BannerQuestionsAndAnswersResult[];
}
