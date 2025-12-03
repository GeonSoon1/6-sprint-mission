import * as s from 'superstruct';

// 유저 회원 가입 유효성 스키마
const createUserSchema = s.object({
  email: s.size(s.nonempty(s.string()), 1, 30),
  nickname: s.size(s.nonempty(s.string()), 1, 30),
  password: s.size(s.nonempty(s.string()), 8, 20),
});

async function validateCreateUser(req, res, next) {
  try {
    s.assert(req.body, createUserSchema);
    next();
  } catch (e) {
    return next(e);
  }
}

// 로그인 유효성 스키마
const loginUserSchema = s.object({
  email: s.size(s.nonempty(s.string()), 1, 30),
  password: s.size(s.nonempty(s.string()), 8, 20),
});

async function validateLoginUser(req, res, next) {
  try {
    s.assert(req.body, loginUserSchema);
    next();
  } catch (e) {
    return next(e);
  }
}

// 유저 프로필 수정 (비밀번호 필수)
const updateUserProfileSchema = s.object({
  nickname: s.optional(s.size(s.nonempty(s.string()), 1, 30)),
  image: s.optional(s.size(s.nonempty(s.string()), 0, 100)),
  password: s.size(s.nonempty(s.string()), 8, 20),
  newPassword: s.optional(s.size(s.nonempty(s.string()), 8, 20)),
});

async function validateUpdateUser(req, res, next) {
  try {
    s.assert(req.body, updateUserProfileSchema);
    next();
  } catch (e) {
    return next(e);
  }
}

// 상품 좋아요, 해제 버튼
// 게시글 좋아요, 해제 버튼
// validateId.js 사용

export { validateCreateUser, validateLoginUser, validateUpdateUser };
