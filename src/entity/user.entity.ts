import { BaseEntity } from './base.entity';
import { Entity, OneToMany } from 'typeorm';
import { BellySafeHistory } from './belly-safe-history.entity';
import { QuestionsAndAnswersSessions } from './questions-and-answers-sessions.entity';
import { Calendar } from './calendar.entity';
import { WishListItem } from './wishlist-item.entity';

@Entity()
export class User extends BaseEntity {
  @OneToMany(() => BellySafeHistory, bellySafeHistory => bellySafeHistory.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  bellySafeHistory!: BellySafeHistory[];

  @OneToMany(
    () => QuestionsAndAnswersSessions,
    questionsAndAnswersSessions => questionsAndAnswersSessions.user,
    {
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  questionsAndAnswersSessions!: QuestionsAndAnswersSessions[];

  @OneToMany(() => WishListItem, wishlistItem => wishlistItem.user)
  wishlistItem!: WishListItem[];

  @OneToMany(() => Calendar, calendar => calendar.user)
  calendars!: Calendar[];
}
