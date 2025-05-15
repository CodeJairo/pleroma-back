import jwt, { SignOptions } from 'jsonwebtoken';
import { UnauthorizedError } from '@utils/index';
import config from 'config/config';

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

export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Error verifying token');
  }
}

export function decodeToken(token: string): any {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Error decoding token');
  }
}
