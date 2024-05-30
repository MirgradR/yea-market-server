import { randomBytes } from 'crypto';
import { hash } from 'argon2';

const HASHING_CONFIG = {
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 10, // number of itetations
} as const;

export const hashPassword = async (passwordString: string) => {
  const salt = randomBytes(16);
  return hash(passwordString, { ...HASHING_CONFIG, salt });
};
