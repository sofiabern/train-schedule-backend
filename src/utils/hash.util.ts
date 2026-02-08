import * as bcrypt from 'bcrypt';

export async function hashPassword(
  password: string,
  rounds = 10,
): Promise<string> {
  return bcrypt.hash(password, rounds);
}

export async function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function validatePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return comparePassword(plain, hashed);
}
