import { prisma } from "../lib/prisma.js";

export async function getuserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function register({ email, password, nickname }) {
  const user = await prisma.user.create({
    data : {
      email,
      password,
      nickname,
    }
  });
  return user;
}