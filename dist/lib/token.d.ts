import { TokenPayload, TokenPair } from '../types/index.js';
export declare function generateTokens(userId: number): TokenPair;
export declare function verifyAccessToken(token: string): TokenPayload;
export declare function verifyRefreshToken(token: string): TokenPayload;
//# sourceMappingURL=token.d.ts.map