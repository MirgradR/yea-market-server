import { GetUserByEmailQuery } from './get-user-by-email.query';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { GetUserQuery } from './get-user.query';
import { GetUsersQuery } from './get-users.query';

export * from './get-users.query';
export * from './get-user.query';
export * from './get-user-by-email.query';
export * from './get-user-by-id.query';

export const USERS_QUERIES = [
  GetUsersQuery,
  GetUserQuery,
  GetUserByEmailQuery,
  GetUserByIdQuery,
];
