import { compareStrings, hashString } from './hash';

describe('auth tests', () => {
  it('should return true when comparing string to the same string but hashed', () => {
    const s = 'string';

    const hashed = hashString(s);
    const result = compareStrings(s, hashed);

    expect(result).toBe(true);
  });

  it('should return false when comparing password to the another string', () => {
    const s = 'password';
    const another = 'passw0rd';

    const result = compareStrings(s, another);

    expect(result).toBe(false);
  });

  it('should return false when comparing password to the another hashed string', () => {
    const s = 'password';
    const another = 'passw0rd';

    const anotherHashed = hashString(another);
    const result = compareStrings(s, anotherHashed);

    expect(result).toBe(false);
  });
});
