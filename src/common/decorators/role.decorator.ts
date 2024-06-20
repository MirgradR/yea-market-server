import { SetMetadata } from '@nestjs/common';
import { AdminRole } from 'src/helpers/constants/adminRole.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
