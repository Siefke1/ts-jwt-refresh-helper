/**
 * Simple in-memory store.
 * Could be replaced with a database or cache for prod.
 */
const validRefreshTokens = new Map<string, string>();

export function storeRefreshToken(jti: string, userId: string) {
  validRefreshTokens.set(jti, userId);
}

export function isRefreshTokenValid(jti: string): boolean {
  return validRefreshTokens.has(jti);
}

export function invalidateRefreshToken(jti: string) {
  validRefreshTokens.delete(jti);
}