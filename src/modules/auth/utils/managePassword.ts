import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function checkPassword (password: string, dbPassword: string): Promise<boolean> {

  const isPasswordValid = await bcrypt.compare(password, dbPassword);

  if(!isPasswordValid) return false

  return true

}
