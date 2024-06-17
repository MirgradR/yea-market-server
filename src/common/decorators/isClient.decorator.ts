import { SetMetadata } from '@nestjs/common';

export const IS_CLIENT_KEY = 'IS_CLIENT_KEY';

export const Client = () => SetMetadata(IS_CLIENT_KEY, true);
