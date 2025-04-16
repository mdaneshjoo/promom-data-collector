import { BaseEntity } from './base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Banner } from './banner.entity';
import { QuestionnaireStage } from './stage.entity';

@Entity()
export class BannerDesignation extends BaseEntity {
  @ManyToOne(() => QuestionnaireStage, questionnaireStage => questionnaireStage.bannerDesignation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  stage!: QuestionnaireStage;

  @ManyToOne(() => Banner, banner => banner.bannerDesignation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  banner!: Banner;
}
