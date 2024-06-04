import { Response } from 'express';

const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;
const expiresDate = new Date(Date.now() + THIRTY_DAYS_IN_MILLISECONDS);

export const setRefreshTokenToCoockie = (
  res: Response,
  refreshToken: string,
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    expires: expiresDate,
    path: '/auth/refresh',
  });
};
