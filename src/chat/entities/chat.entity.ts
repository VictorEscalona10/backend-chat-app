import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    chat_id: string

    @Column()
    first_user_id: string

    @Column()
    second_user_id: string

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}
