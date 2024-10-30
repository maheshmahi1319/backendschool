import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // Use the definite assignment assertion operator

  @Column({ unique: true })
  username!: string; // Add ! to other properties if necessary

  @Column()
  password!: string;

  @Column()
  role!: string;

  @Column({ type: 'text' , default: '' })
  refreshToken!: string;
}

