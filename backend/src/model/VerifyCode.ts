import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class VerifyCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: number;

  @OneToOne(() => User, user => user.verifyCode)
  user: User;
}
