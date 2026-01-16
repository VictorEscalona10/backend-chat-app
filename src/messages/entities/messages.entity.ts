import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    message_id: string;

    @Column('uuid')
    user_id: string;

    @Column('text')
    content: string;

    @Column({ default: false })
    is_read: boolean;

    @Column({ default: false })
    is_received: boolean;

    @Column({ default: false })
    is_deleted: boolean;

    @Column('uuid')
    chat_id: string;

    @Column({ nullable: true })
    message_type: string;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;
}