import { UserEntity } from 'src/entities';

export type UserEntityPublic = Omit<UserEntity, 'passwordHash'>;
