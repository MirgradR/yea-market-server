import { generateExpiryDate } from './generateExpiryDate';

export function generateVerificationCodeAndExpiry() {
  const expiryTime = generateExpiryDate(10, 'minute');
  let code: string;
  if (process.env.NODE_ENV === 'development') {
    code = '123456';
    return { code, expiryTime };
  }
  return { code, expiryTime };
}
