import { Response } from 'express';

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('authToken', token, {
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict', 
    maxAge: 3600000, 
  });
};