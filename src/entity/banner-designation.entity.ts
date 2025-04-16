import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Banner } from './banner.entity';
import { QuestionnaireStage } from './stage.entity';

@Entity()
export class BannerDesignation extends BaseEntity {
  @Column()
  stageId!: number;

  @ManyToOne(() => QuestionnaireStage, questionnaireStage => questionnaireStage.bannerDesignation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  stage!: QuestionnaireStage;

  @Column()
  bannerId!: number;

  @ManyToOne(() => Banner, banner => banner.bannerDesignation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  banner!: Banner;
}
