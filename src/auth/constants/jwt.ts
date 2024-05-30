import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
export const configService = new ConfigService();

export const JWT_KEYS = {
  ACCESS_SECRET: configService.get<string>('SERVICE_JWT_SECRET'),
  REFRESH_SECRET: configService.get<string>('SERVICE_JWT_REFRESH_SECRET'),
} as const;
