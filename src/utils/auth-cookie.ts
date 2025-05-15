import { Response } from 'express';
import config from 'config/config';

/**
 * Sets an authentication cookie in the HTTP response.
 *
 * @param res - The HTTP response object where the cookie will be set.
 * @param token - The authentication token to be stored in the cookie.
 *
 * The cookie is configured with the following properties:
 * - `httpOnly`: Ensures the cookie is only accessible via HTTP(S) requests and not client-side scripts.
 * - `secure`: Indicates whether the cookie should only be sent over HTTPS. This is determined by the `nodeEnvironment` configuration.
 * - `sameSite`: Set to 'none' to allow cross-site requests.
 * - `maxAge`: Specifies the duration (in milliseconds) for which the cookie is valid. In this case, 1 hour.
 */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: config.nodeEnvironment === 'production',
    sameSite: 'none',
    maxAge: 1000 * 60 * 60, // 1 hour
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
