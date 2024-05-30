import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import { IsEmail, IsUUID, Length, IsDate, IsUrl } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
@Unique(['email', 'phone'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  @Length(1, 255)
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  @Length(1, 255)
  lastName: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  @Length(1, 255)
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Length(1, 255)
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Length(1, 255)
  country: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Length(1, 255)
  city: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  @IsEmail()
  email: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  @IsDate()
  birthday: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Length(1, 255)
  address: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'avatar_url' })
  @IsUrl()
  avatarUrl: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'refresh_token',
    nullable: true,
  })
  @Length(1, 255)
  refreshToken: string | null;
}
