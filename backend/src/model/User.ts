import { Entity, PrimaryGeneratedColumn, Column , OneToOne , JoinColumn, BeforeInsert, ManyToMany, JoinTable } from "typeorm"
import { VerifyCode } from "./VerifyCode";
import bcrypt from "bcryptjs";
import { Interests } from "./Interests";


@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	isVerified: boolean;

	@OneToOne(() => VerifyCode, (verifyCode) => verifyCode.user)
	@JoinColumn()
	verifyCode: VerifyCode;

	@ManyToMany(() => Interests)
	@JoinTable()
	interests: Interests[];

	@BeforeInsert()
  	async hashPassword() {
    	this.password = await bcrypt.hash(this.password, 10);
  	}
}