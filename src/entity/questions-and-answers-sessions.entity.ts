import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BannerQuestionsAndAnswersResult } from './banner-questions-and-answers-result.entity';

@Entity()
export class QuestionsAndAnswersSessions extends BaseEntity {
  @Column({ type: 'text' })
  title!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, user => user.questionsAndAnswersSessions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user!: Partial<User>;

  @Column()
  bannerQuestionsAndAnswersResultId!: number;

  @ManyToOne(
    () => BannerQuestionsAndAnswersResult,
    bannerQuestionsAndAnswersResult => bannerQuestionsAndAnswersResult.questionsAndAnswersSessions,
    {
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn()
  bannerQuestionsAndAnswersResult!: BannerQuestionsAndAnswersResult;
}
