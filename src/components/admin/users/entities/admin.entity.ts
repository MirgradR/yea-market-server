import { AdminRole } from 'src/helpers/constants/adminRole.enum';
import { MediaEntity } from 'src/libs/media/entities/media.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AdminTokensEntity } from '../../token/entities/tokens.entity';

@Entity('admins')
export class AdminsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
  })
  role: AdminRole;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => MediaEntity, (media) => media.admin)
  media?: MediaEntity;

  @OneToOne(() => AdminTokensEntity, (token) => token.admin)
  @JoinColumn()
  token?: AdminTokensEntity;
}
