import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('logs')
export class LogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  host: string;

  @Column({ nullable: true })
  url: string;

  @Column({ name: 'status_code', nullable: true })
  statusCode: number;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  user: string;

  @Column({ nullable: true })
  context: string;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  time: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
