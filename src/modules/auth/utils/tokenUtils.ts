import { randomBytes, createHash } from 'crypto';

export function generateResetToken() {

    const token = randomBytes(32).toString('hex'); // token in chiaro, 64 caratteri esadecimali
    const hashedToken = createHash('sha256').update(token).digest('hex'); // hash SHA-256

    return { token, hashedToken };

}