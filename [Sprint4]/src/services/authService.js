import prisma from '../lib/prisma.js';
import { UserRepository } from '../repositories/userRepository.js';
import { verifyRefreshToken, generateTokens } from '../lib/token.js';

const userRepository = new UserRepository(prisma.user);

export const authService = {
  refresh: async (refreshToken) => {
    // 1. Refresh Token 검증
    //   - 토큰이 유효한지, 만료되지는 않았는지 확인
    //   - 유효하지 않다면 여기서 에러발생 및 함수 중단
    const { userId } = verifyRefreshToken(refreshToken);

    // 2. DB에서 사용자 정보 조회
    //  - 토큰에 담겨있던 userId로 사용자 조회
    const user = await userRepository.findUserById(userId);
    if (!user) {
      const error = new Error('존재하지 않는 사용자입니다.');
      error.status = 404;
      throw error;
    }

    console.log('[토큰 갱신] 클라이언트가 보낸 토큰:', refreshToken);
    console.log('[토큰 갱신] DB에서 조회한 유저 정보:', user.refreshToken);

    // 3. DB의 Refresh Token과 클라이언트의 Refresh Token 비교
    //   - 사용자가 가장 마지막으로 발급받은 Refresh Token과 일치하는지 확인
    //   - 만약 일치하지 않는다면, 다른 곳에서 로그인 했거나 토큰이 탈취당했을 가능성이 있음
    if (user.refreshToken !== refreshToken) {
      const error = new Error('유효하지 않은 리프레시 토큰입니다');
      error.status = 401;
      throw error;
    }

    // 4. 모든 검증 통과! 새로운 Access Token 발급
    //    - 기존 Refresh Token 은 유지하고, 새로운 Access Token만 발급
    const { accessToken: newAccessToken } = generateTokens(user.id);

    // 5. 새로 발급된 Access Token 반환
    return newAccessToken;
  },
};
