import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Calendar } from './calendar.entity';

@Entity()
export class Event extends BaseEntity {
  @Column()
  calendarId!: number;

  @ManyToOne(() => Calendar, calendar => calendar.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  calendar!: Calendar;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  title?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  note?: string;
}
