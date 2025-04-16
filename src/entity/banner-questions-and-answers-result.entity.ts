import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BannerQuestionsAndAnswers } from './banner-questions-and-answers.entity';
import { QuestionsAndAnswersSessions } from './questions-and-answers-sessions.entity';
import { QuestionnaireStage } from './stage.entity';

@Entity()
export class BannerQuestionsAndAnswersResult extends BaseEntity {
  @Column()
  bannerQuestionsAndAnswersId!: number;

  @ManyToOne(
    () => BannerQuestionsAndAnswers,
    bannerQuestionsAndAnswers => bannerQuestionsAndAnswers.bannerQuestionsAndAnswersResults,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  bannerQuestionsAndAnswers!: BannerQuestionsAndAnswers;

  @Column()
  stageId!: number;

  @ManyToOne(
    () => QuestionnaireStage,
    questionnaireStage => questionnaireStage.bannerQuestionsAndAnswersResults,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  stage!: QuestionnaireStage;

  @OneToMany(
    () => QuestionsAndAnswersSessions,
    questionsAndAnswersSession => questionsAndAnswersSession.bannerQuestionsAndAnswersResult,
  )
  questionsAndAnswersSessions!: QuestionsAndAnswersSessions[];

  @Column({ type: 'text' })
  result!: string;
}
