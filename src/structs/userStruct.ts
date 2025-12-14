import * as s from 'superstruct';

// 회원가입
export const RegisterUser = s.object({
  email: s.string(),
  nickname: s.string(),
  password: s.string(), // 필요하면 최소 길이 체크는 나중에 커스텀으로
});

// 로그인
export const LoginUser = s.object({
  email: s.string(),
  password: s.string(),
});

// 수정
export const PatchProfile = s.partial(
  s.object({
    email: s.string(),
    nickname: s.string(),
    image: s.string(),
  })
);

// 비밀번호 변경
export const ChangePassword = s.object({
  currentPassword: s.string(),
  newPassword: s.string(),
});
