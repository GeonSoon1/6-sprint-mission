import { prisma } from "../lib/prisma.js";

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data
  })
} 

export async function updatePassword(id, newPassword) {
  return await prisma.user.update({
    where: { id }, 
    data: {
      password: newPassword
    }
  })
}