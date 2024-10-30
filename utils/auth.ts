import { hashSync, compareSync } from 'bcrypt';

const SALT = 5;

export function hashPassword(plainTextPassword: string): string {
  return hashSync(plainTextPassword, SALT);
}

export function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
): boolean {
  return compareSync(plainTextPassword, hashedPassword);
}
