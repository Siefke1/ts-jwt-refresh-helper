import { signTokens, TokenPayload } from '../src/tokens';
import { storeRefreshToken } from '../src/refreshStore';
import { rotateRefreshToken } from '../src/rotate';

describe('rotate.ts', () => {
  const payload: TokenPayload = { userId: 'user123', jti: 'initial-jti' };
  let initialTokens: { accessToken: string; refreshToken: string };

  beforeAll(() => {
    process.env.ACCESS_TOKEN_SECRET = 'testsecret';
    process.env.REFRESH_TOKEN_SECRET = 'testsecret2';
    process.env.ACCESS_TOKEN_EXPIRY = '1h';
    process.env.REFRESH_TOKEN_EXPIRY = '1d';

    initialTokens = signTokens(payload);
    storeRefreshToken(payload.jti!, payload.userId);
  });

  it('should rotate refresh token and invalidate old one', () => {
    const newPair = rotateRefreshToken(initialTokens.refreshToken);
    expect(newPair.refreshToken).not.toBe(initialTokens.refreshToken);
    expect(() => rotateRefreshToken(initialTokens.refreshToken)).toThrow();
  });
});