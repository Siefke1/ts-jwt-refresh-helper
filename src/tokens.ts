import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  jti?: string;
  [key: string]: any;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Options for token expiry
const defaultAccessExpiry = process.env.ACCESS_TOKEN_EXPIRY ?? '15m';
const defaultRefreshExpiry = process.env.REFRESH_TOKEN_EXPIRY ?? '7d';

/**
 * Signs a new pair of access and refresh tokens.
 * Throws if the necessary secrets are not set.
 */
export function signTokens(payload: TokenPayload): TokenPair {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!accessSecret || !refreshSecret) {
    throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in .env');
  }

  const accessOptions: SignOptions = { expiresIn: defaultAccessExpiry as "15m" };
  const refreshOptions: SignOptions = { expiresIn: defaultRefreshExpiry as "7d" };

  const accessToken = jwt.sign(
    payload,
    accessSecret as Secret,
    accessOptions
  );

  const refreshToken = jwt.sign(
    payload,
    refreshSecret as Secret,
    refreshOptions
  );

  return { accessToken, refreshToken };
}

/**
 * Verifies an access token and returns its payload.
 * Throws if the secret is missing or token is invalid.
 */
export function verifyAccessToken(token: string): TokenPayload {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET must be defined in .env');
  }
  return jwt.verify(token, secret as Secret) as TokenPayload;
}

/**
 * Verifies a refresh token and returns payload.
 * Throws if secret is missing or token invalid.
 */
export function verifyRefreshToken(token: string): TokenPayload {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET must be defined in .env');
  }
  return jwt.verify(token, secret as Secret) as TokenPayload;
}