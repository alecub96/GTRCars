import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) {
    return secret;
  }
  return 'gtcars-supercar-vault-secret-key-2026';
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'TRAVELER' | 'OWNER' | 'ADMIN' | 'SUPPORT';
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d', algorithm: 'HS256' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as TokenPayload;
  } catch {
    return null;
  }
}
