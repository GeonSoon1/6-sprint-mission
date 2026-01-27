import { RegisterBodyStruct, LoginBodyStruct } from '../structs/auth.struct.js'
import { Request, Response } from "express";
import {create} from 'superstruct'
import * as authServices from '../services/auth.service.js'
import { clearTokenCookies, setTokenCookies } from '../lib/cookies.js'

export async function register(req, res) {
  const data = create(req.body, RegisterBodyStruct)
  const user = await authServices.register(data)
  return res.status(201).json(user)
}

export async function login(req, res) {
  const data = create(req.body, LoginBodyStruct)
  const { accessToken, refreshToken } = await authServices.login(data)
  setTokenCookies(res, accessToken, refreshToken)
  return res.sendStatus(200)
}

export async function logout(req, res) {
  clearTokenCookies(res)
  return res.sendStatus(200)
}
