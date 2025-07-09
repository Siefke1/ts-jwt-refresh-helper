# ts-jwt-refresh-helper

A small, reusable TypeScript/Node.js library for issuing, verifying, and rotating JSON Web Tokens (JWTs) with built-in refresh token support and secure token revocation.

---

## Key Features

- **Access & Refresh Tokens**  
  Generate short-lived access tokens and long-lived refresh tokens in one API call.

- **Refresh Token Rotation**  
  Each use of a refresh token invalidates the previous one, preventing token replay.

- **Pluggable Store**  
  Default in-memory store for tracking valid JTIs; swap in Redis or a database for production.

- **Express Middleware**  
  `requireAuth` to guard any route by verifying the access token.

- **TypeScript-First**  
  Fully typed payloads, interfaces, and function signatures.

- **Jest Tests Included**  
  Coverage for signing, verification, and rotation logic.

---

## Technologies

- **Node.js** (>=14)  
- **TypeScript**  
- **jsonwebtoken** for JWT operations  
- **dotenv** for loading environment variables  
- **Jest** with **ts-jest** for testing  

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/ts-jwt-refresh-helper.git
cd ts-jwt-refresh-helper
npm install
```

### 2. Environment Variables

Copy the example .env and fill in your secrets:
```bash
cp example.env .env
```

- ACCESS_TOKEN_SECRET: secret for signing access tokens
- REFRESH_TOKEN_SECRET: secret for signing refresh tokens
- ACCESS_TOKEN_EXPIRY: e.g. 15m, 1h
- REFRESH_TOKEN_EXPIRY: e.g. 7d, 30d

### 3. Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### 4. Usage

Import and use:
```ts
import express from 'express';
import {
  signTokens,
  verifyAccessToken,
  rotateRefreshToken,
  requireAuth
} from '@your-org/jwt-refresh-helper';

const app = express();

// Sign tokens
const { accessToken, refreshToken } = signTokens({ userId: 'abc123', jti: 'initial-jti' });

// Verify access token
const user = verifyAccessToken(accessToken);

// Rotate refresh token
const newTokens = rotateRefreshToken(refreshToken);

// Protect Express routes
app.get('/protected', requireAuth, (req, res) => {
  res.send(`Hello ${(req as any).user.userId}`);
});
```
### 5. Testing

Run the included Jest test suite:
```bash
npm test
```

### Project Structure
```psql
ts-jwt-refresh-helper/
├── package.json
├── tsconfig.json
├── jest.config.ts
├── .env.example
├── src/
│   ├── index.ts
│   ├── tokens.ts
│   ├── rotate.ts
│   ├── refreshStore.ts
│   └── middleware.ts
└── __tests__/
    ├── tokens.test.ts
    └── rotate.test.ts
```