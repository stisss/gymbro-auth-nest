import { comparePasswords, hashPassword } from './auth';

describe('auth tests', () => {
  it('should return true when comparing password to the same password but hashed', () => {
    const password = 'password';

    const hashed = hashPassword(password);
    const result = comparePasswords(password, hashed);

    expect(result).toBe(true);
  });

  it('should return false when comparing password to the another string', () => {
    const password = 'password';
    const another = 'passw0rd';

    const result = comparePasswords(password, another);

    expect(result).toBe(false);
  });

  it('should return false when comparing password to the another hashed string', () => {
    const password = 'password';
    const another = 'passw0rd';

    const anotherHashed = hashPassword(password);
    const result = comparePasswords(password, anotherHashed);

    expect(result).toBe(true);
  });
});
