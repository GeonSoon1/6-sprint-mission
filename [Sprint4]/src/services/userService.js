import prisma from '../lib/prisma.js';
import { UserRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import { exclude } from '../lib/prismaUtil.js';
import { generateTokens } from '../lib/token.js';

const userRepository = new UserRepository(prisma.user);

export const userService = {
  // 로그인
  login: async (loginData) => {
    const { email, password } = loginData;

    // check userEmail
    const user = await userRepository.findUserByEmailOrNickname(email);
    if (!user) {
      const error = new Error('이메일이 올바르지 않습니다.');
      error.status = 401;
      throw error;
    }

    // check userPassword
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('비밀번호가 올바르지 않습니다.');
      error.status = 401;
      throw error;
    }

    // create token
    const { accessToken, refreshToken } = generateTokens(user.id);

    // -> Refresh Token을 DB에 저장하는 코드 추가
    const updatedUser = await userRepository.patchUser(user.id, {
      refreshToken,
    });

    const userFromDb = await userRepository.findUserById(user.id);
    console.log('[로그인] DB에 저장된 유저 정보:', userFromDb.refreshToken);

    // return userInfo and token excluding password
    const userWithoutPassword = exclude(updatedUser, ['password']);
    return { user: userWithoutPassword, accessToken, refreshToken };
  },

  // 회원가입
  create: async (userData) => {
    const { email, nickname, password, userPreference, ...rest } = userData;
    console.log(userData);

    // 1. 이메일 또는 닉네임 중복 확인
    const existingUser = await userRepository.findUserByEmailOrNickname(
      email,
      nickname,
    );
    if (existingUser) {
      const err = new Error('이미 사용중인 이메일 또는 닉네임입니다.');
      err.status = 409;
      throw err;
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email,
      nickname,
      password: hashedPassword,
      ...rest,
      userPreference: {
        create: userPreference,
      },
    };
    const options = {
      include: { userPreference: true },
    };

    // 3. 사용자 데이터를 DB에 저장
    const newUser = await userRepository.createUser(data, options);

    // 4. 생성된 사용자 정보에서 비밀번호를 제외하고 반환
    return exclude(newUser, ['password']);
  },

  // update
  // user가 자신의 정보(비밀번호, 닉네임, 주소)를 업데이트 기능
  // email은 수정 불가
  update: async (id, userData) => {
    const { email, nickname, password, userPreference, ...rest } = userData;

    // check userEmail
    const user = await userRepository.findUserByEmailOrNickname(email);
    if (!user) {
      const error = new Error('이메일을 확인해주세요.');
      error.status = 401;
      throw error;
    }
    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email,
      nickname,
      password: hashedPassword,
      ...rest,
      userPreference: {
        create: userPreference,
      },
    };
    console.log(data);
    const options = {
      include: { userPreference: true },
    };
    return userRepository.patchUser(id, data, options);
  },

  // delete
  delete: async (id) => {
    return userRepository.deleteUser(id);
  },

  // findById
  // user가 자신의 정보조회 기능
  findById: async (id) => {
    return userRepository.findUserById(id);
  },

  // findById
  // user가 자신의 정보조회 기능
  findByEmail: async (email) => {
    return userRepository.findUserByEmail(email);
    // const checkEmail =
  },

  // find - option: nickname, email
  find: async (query) => {
    const { nickname, email } = query;
    console.log(query);
    const findOptions = {
      ...(nickname && {
        where: { nickname: { contains: nickname, mode: 'insensitive' } },
      }),
      ...(email && {
        where: { email: { contains: email, mode: 'insensitive' } },
      }),
      include: { userPreference: true },
    };
    return userRepository.findUsers(findOptions);
  },
};
