import * as userRepo from '../repositories/user.repo.js'
import NotFoundError from '../errors/NotFoundError.js'
import { hashPassword } from '../lib/hash.js'

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