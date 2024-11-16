import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ClientTokensEntity } from '../../token/entities/token.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  company: string;

  @Column({ name: 'country_region' })
  countryRegion: string;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @OneToOne(() => ClientTokensEntity, (token) => token.user)
  @JoinColumn()
  token?: ClientTokensEntity;
}
