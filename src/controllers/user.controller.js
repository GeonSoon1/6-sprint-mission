import * as userServices  from '../services/user.service.js'
import { create } from 'superstruct'
import { UpdateUserBodyStruct } from '../structs/auth.struct.js'

export async function getUser(req, res) {
  const user = await userServices.getUser(req.user)
  return res.json(user)
}

export async function updateUser(req, res) {
  const data = create(req.body, UpdateUserBodyStruct)
  const updated = await userServices.updateUser(data, req.user)
  return res.json(updated)
}

export async function updatePassword(req, res) {
  const data = create(req.body, UpdateUserBodyStruct)
  const updated = await userServices.updatePassword(data, req.user)
  return res.json(updated)
}