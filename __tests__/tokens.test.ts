import { signTokens, verifyAccessToken, verifyRefreshToken, TokenPayload } from '../src/tokens';

describe('tokens.ts', () => {
  const payload: TokenPayload = { userId: 'user123', jti: 'test-jti' };
  let tokens: { accessToken: string; refreshToken: string };

  beforeAll(() => {
    process.env.ACCESS_TOKEN_SECRET = 'testsecret';
    process.env.REFRESH_TOKEN_SECRET = 'testsecret2';
    process.env.ACCESS_TOKEN_EXPIRY = '1h';
    process.env.REFRESH_TOKEN_EXPIRY = '1d';
    tokens = signTokens(payload);
  });

  it('should return access and refresh tokens as strings', () => {
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('verifyAccessToken should decode the correct payload', () => {
    const decoded = verifyAccessToken(tokens.accessToken);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.jti).toBe(payload.jti);
  });

  it('verifyRefreshToken should decode the correct payload', () => {
    const decoded = verifyRefreshToken(tokens.refreshToken);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.jti).toBe(payload.jti);
  });
});