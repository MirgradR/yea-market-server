import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'IS_ADMIN_KEY';

export const Admin = () => SetMetadata(IS_ADMIN_KEY, true);
