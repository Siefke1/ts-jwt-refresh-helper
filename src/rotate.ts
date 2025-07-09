import { randomUUID } from 'crypto';
import {
  verifyRefreshToken,
  signTokens,
  TokenPayload,
  TokenPair,
} from './tokens';
import {
  storeRefreshToken,
  isRefreshTokenValid,
  invalidateRefreshToken,
} from './refreshStore';

/**
 * Rotates a refresh token: verifies old, invalidates it, and issues new pair.
 * Strips JWT-specific claims from payload before sign to avoid exp/iat conflicts.
 */
export function rotateRefreshToken(oldToken: string): TokenPair {
  const payload = verifyRefreshToken(oldToken) as TokenPayload & { exp?: number; iat?: number };
  const oldJti = payload.jti;
  if (!oldJti || !isRefreshTokenValid(oldJti)) {
    throw new Error('Invalid or revoked refresh token');
  }

  invalidateRefreshToken(oldJti);

  const newJti = randomUUID();
  const { exp, iat, ...restPayload } = payload;
  const newPayload: TokenPayload = { ...restPayload, jti: newJti };

  const tokens = signTokens(newPayload);

  storeRefreshToken(newJti, payload.userId);

  return tokens;
}