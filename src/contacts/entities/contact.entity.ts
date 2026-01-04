import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    contact_id: string

    @Column()
    user_id: string

    @Column()
    nickname: string

    @Column()
    email: string

    @ManyToOne(() => User, user => user.email, { eager: true })
    @JoinColumn({ name: 'email', referencedColumnName: 'email' })
    user: User;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}
