import { Response } from 'express';
import config from '../config/config';

/**
 * Sets an authentication cookie in the HTTP response.
 *
 * @param res - The HTTP response object where the cookie will be set.
 * @param token - The authentication token to be stored in the cookie.
 *
 * The cookie is configured with:
 * - `httpOnly`: Prevents client-side access.
 * - `secure`: Only sent over HTTPS in production.
 * - `sameSite`: 'none' for cross-site requests, 'strict' in production.
 * - `maxAge`: Cookie expires in 1 day.
 */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie(config.serverCookieKey, token, {
    httpOnly: true,
    secure: config.nodeEnvironment === 'production' ? true : false,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
  return;
}

export function setClientCookie(res: Response, token: string): void {
  res.cookie(config.clientCookieKey, token, {
    httpOnly: false,
    secure: config.nodeEnvironment === 'production' ? true : false,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15, // 15 minutes
  });
  return;
}

/**
 * Clears the authentication cookie from the HTTP response.
 *
 * @param res - The HTTP response object where the cookie will be cleared.
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie('auth_token');
  return;
}
