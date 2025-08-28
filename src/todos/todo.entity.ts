import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;


  @Column({ default: false })
  done: boolean;

  @ManyToOne(() => User, (user) => user.todos, { eager: false, onDelete: 'CASCADE' })
  owner: User;
}
