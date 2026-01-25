import { create } from 'superstruct'
import { IdParamsStruct } from "../structs/common.struct.js"
import { UpdateCommentBodyStruct } from '../structs/comment.struct.js'
import * as commentServices from '../services/comment.service.js'

export async function getComment(req, res) {
  const { id:commentId } = create(req.params, IdParamsStruct)
  const comment = await commentServices.getComment(commentId)
  return res.json(comment)
}

export async function updateComment(req, res) {
  const { id: commentId } = create(req.params, IdParamsStruct)
  const data = create(req.body, UpdateCommentBodyStruct)
  const updated = await commentServices.updateComment(commentId, data, req.user) 
  return res.json(updated)
}

export async function deleteComment(req, res) {
  const { id:commentId } = create(req.params, IdParamsStruct)
  await commentServices.deleteComment(commentId, req.user)
  return res.sendStatus(204)
}