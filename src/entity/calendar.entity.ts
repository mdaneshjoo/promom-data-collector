import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity()
export class Calendar extends BaseEntity {
  @Column()
  userId!: number;

  @ManyToOne(() => User, user => user.calendars, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Event, event => event.calendar, { cascade: true })
  events!: Event[];
}
