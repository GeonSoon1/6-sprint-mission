import { ACCESS_TOKEN_COOKIE_NAME } from "../lib/constants";
import UnauthorizedError from "../errors/UnauthorizedError";
import { verifyAccessToken } from "../lib/token";
import { prisma } from "../lib/prisma";

export async function authenticate(req, res, next) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    throw new UnauthorizedError("토큰이 존재하지 않습니다.");
  }
  const { userId } = verifyAccessToken(accessToken);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new UnauthorizedError("해당 유저가 존재하지 않습니다.");
  }
  req.user = user;
  next();
}
