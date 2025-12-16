import { userService } from '../services/userService.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';

// 로그인
export const login = async (req, res, next) => {
  // 1. userService.login 호출
  const { user, accessToken, refreshToken } = await userService.login(req.body);

  // 2. accessToken을 쿠키에 저장
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  // 3. refreshToken을 쿠키에 저장
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json(user);
};

// 회원가입
export const createUser = async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).send(user);
};

// 회원정보 수정
export const patchUser = async (req, res) => {
  const { id } = req.params;
  const user = await userService.update(id, req.body);
  res.status(200).send(user);
};

// 회원정보 보기
export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await userService.findById(id);
  res.status(200).send(user);
};

// 회원탈퇴(삭제)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await userService.delete(id);
  res.status(204).send();
};

// 회원찾기
export const getSearchUser = async (req, res) => {
  const search = await userService.find(req.query);
  res.status(200).send(search);
};
