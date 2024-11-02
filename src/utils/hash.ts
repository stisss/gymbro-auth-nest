import { hashSync, compareSync } from 'bcrypt';

const SALT = 5;

export function hashString(plainTextString: string): string {
  return hashSync(plainTextString, SALT);
}

export function compareStrings(
  plainTextString: string,
  hashedString: string,
): boolean {
  return compareSync(plainTextString, hashedString);
}
