import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class Interests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  interest: string;

  @ManyToMany(() => User, user => user.interests)
  users: User[];

}
