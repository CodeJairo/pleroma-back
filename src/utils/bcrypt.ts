import bcrypt from 'bcrypt';
import { InternalServerError } from './custom-errors';

const saltRounds = 12;

/**
 * Asynchronously generates a hashed version of the provided password using bcrypt.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password as a string.
 * @throws {InternalServerError} If hashing the password fails.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new InternalServerError('Error hashing the password, please try again');
  }
}

/**
 * Compares a plain text password with a hashed password to determine if they match.
 *
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to `true` if the passwords match, or `false` otherwise.
 * @throws {InternalServerError} If comparison fails.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new InternalServerError('Error validating the password, please try again');
  }
}
