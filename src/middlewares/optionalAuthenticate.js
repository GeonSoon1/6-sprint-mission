import { ACCESS_TOKEN_COOKIE_NAME } from "../lib/constants.js";
import { verifyAccessToken } from "../lib/token.js";
import { prisma } from "../lib/prisma.js";

export async function optionalAuthenticate(req, res, next) {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const { userId } = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    req.user = user || null;
  } catch {
    req.user = null;
  }

  return next();
}
