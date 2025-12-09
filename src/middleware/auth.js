// TODO) Auth: 요청마다 실행되는 커스텀 로직
// &) Service Import
import { authService } from '../services/auth-service.js';

// ?) 헤더 검사
export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [type, token] = auth.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: '승인 헤더가 없거나 형식이 잘못되었습니다',
    });
  }

  try {
    const decoded = authService.verifyAccessToken(token);
    req.user = { id: decoded.id, email: decoded.email };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '유효하지 않거나 만료된 토큰입니다',
    });
  }
}
