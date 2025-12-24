import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,  } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ unique: true })
    email: string;
    
    @Column()
    username: string;

    @Column()
    birthdate: Date;

    @Column()
    profilePhotoUrl: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'datetime' }) 
    createdAt: Date; 
    
    @UpdateDateColumn({ type: 'datetime' }) 
    updatedAt: Date;
}
