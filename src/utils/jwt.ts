import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config/config';
import { InternalServerError } from './custom-errors';

const JWT_SECRET = config.jwtSecret;
if (!JWT_SECRET) throw new InternalServerError('JWT secret is not configured');

export function generateToken(payload: object, expiresIn: any = '1h') {
  try {
    const options: SignOptions = { expiresIn };
    const token = jwt.sign(payload, JWT_SECRET!, options);
    return token;
  } catch (error) {
    throw new InternalServerError('Error generating token');
  }
}

export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new InternalServerError('Error verifying token');
  }
}

export function decodeToken(token: string): any {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    throw new InternalServerError('Error decoding token');
  }
}
