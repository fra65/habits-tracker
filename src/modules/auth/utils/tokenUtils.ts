import { randomBytes, createHash } from 'crypto';

interface ResetTokenResult {
  token: string;
  hashedToken: string;
}

export function generateResetToken(token?: string): ResetTokenResult {
  let tokenToHash: string;

  if (token !== undefined) {
    if (typeof token !== 'string') {
      throw new TypeError('Il token deve essere una stringa.');
    }
    // Optional: valida che sia esadecimale (64 caratteri, 32 byte)
    const hexRegex = /^[a-f0-9]{64}$/i;
    if (!hexRegex.test(token)) {
      throw new Error('Il token fornito non è un valore esadecimale valido di 64 caratteri.');
    }
    tokenToHash = token.toLowerCase();
  } else {
    tokenToHash = randomBytes(32).toString('hex');
  }

  const hashedToken = createHash('sha256').update(tokenToHash).digest('hex');

  return { token: tokenToHash, hashedToken };
}
