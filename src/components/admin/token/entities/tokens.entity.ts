import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminsEntity } from '../../users/entities/admin.entity';

@Entity('admin_tokens')
export class AdminTokensEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column({ name: 'admin_id', nullable: true })
  adminId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => AdminsEntity, (admin) => admin.token, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin: AdminsEntity;
}
