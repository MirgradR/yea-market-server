import { SetMetadata } from '@nestjs/common';

export const IS_SPECIALIST_KEY = 'IS_SPECIALIST_KEY';

export const Specialist = () => SetMetadata(IS_SPECIALIST_KEY, true);
