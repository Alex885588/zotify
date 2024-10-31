import { UserRole } from 'src/enums/user.role.enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.User,
    })
    role: UserRole;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
