import jwt, { SignOptions } from 'jsonwebtoken';
import { UnauthorizedError } from '@utils/index';
import config from '../config/config';

const JWT_SECRET = config.jwtSecret;
if (!JWT_SECRET) throw new UnauthorizedError('JWT secret is not configured');

/**
 * Generates a JWT token with the given payload and expiration time.
 * @param payload - The payload to include in the token.
 * @param expiresIn - The expiration time for the token (default is '1h').
 * @returns - The generated JWT token.
 */
export function generateToken(payload: object, expiresIn: any = '1h') {
  try {
    const options: SignOptions = { expiresIn };
    const token = jwt.sign(payload, JWT_SECRET!, options);
    return token;
  } catch (error) {
    throw new UnauthorizedError('Error generating token');
  }
}

/**
 * Verifies a JWT token and returns the decoded payload.
 *
 * @param token - The JWT token string to verify.
 * @returns The decoded payload of the verified token.
 * @throws {UnauthorizedError} If the token verification fails.
 */
export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Error verifying token');
  }
}

/**
 * Decodes a JWT token and returns its payload.
 *
 * @param token - The JWT token string to decode.
 * @returns The decoded payload of the token, or `null` if the token is invalid.
 * @throws UnauthorizedError If there is an error decoding the token.
 */
export function decodeToken(token: string): any {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Error decoding token');
  }
}
