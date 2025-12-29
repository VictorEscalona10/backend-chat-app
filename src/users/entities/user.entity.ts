import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ nullable: true, type: 'varchar' })
    verificationCode: string | null;

    @Column({ type: 'datetime', nullable: true })
    verificationCodeExpires: Date | null;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'datetime', nullable: true })
    verifiedAt: Date | null; 

    @Column({ nullable: true, type: 'varchar' })
    profilePhotoUrl: string | null; 

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'varchar' })
    loginCode: string | null;

    @Column({ type: 'datetime', nullable: true })
    loginCodeExpires: Date | null;
    
    @CreateDateColumn({ type: 'datetime' }) 
    createdAt: Date; 
    
    @UpdateDateColumn({ type: 'datetime' }) 
    updatedAt: Date;
}