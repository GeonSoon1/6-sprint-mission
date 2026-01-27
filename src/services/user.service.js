import * as userRepo from '../repositories/user.repo'
import NotFoundError from '../errors/NotFoundError'
import { hashPassword } from '../lib/hash'

export async function getUser(user) {
  const existingUser = await userRepo.getUserById(user.id)
  if (!existingUser) {
    throw new NotFoundError('유저를 찾을 수 없습니다.')
  }
  return existingUser
}

export async function updateUser(data, user) {
  const existingUser = await userRepo.getUserById(user.id)
  if (!existingUser) {
    throw new NotFoundError('유저를 찾을 수 없습니다.')
  }
  const updated = await userRepo.updateUser(user.id, data)
  return updated 
}

export async function updatePassword(data, user) {
  const existingUser = await userRepo.getUserById(user.id)
  if (!existingUser) {
    throw new NotFoundError('유저를 찾을 수 없습니다.')
  }
  const hashedPassword = await hashPassword(data.password)

  const updated = await userRepo.updatePassword(user.id, hashedPassword)
  return updated
}