export const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'P2025') {
    return res.status(404).json({ message: '데이터를 찾을 수 없습니다.' });
  }

  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({ message: '요청 데이터 형식이 올바르지 않습니다.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: '토큰이 만료되었습니다. 다시 로그인해주세요.' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }

  if (err.name === 'StructError') {
    return res.status(400).json({
      message: `입력 값 형식이 올바르지 않습니다. (${err.message})`,
    });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
};

export function defaultNotFoundHandler(req, res, next) {
  return res.status(404).send({ message: '요청하신 페이지를 찾을 수 없습니다.' });
}
