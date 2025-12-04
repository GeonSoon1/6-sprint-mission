import * as s from 'superstruct';
import isEmail from 'is-email';

// s.define이 원하는 함수 형식으로 emailValidator로 재구성
// 타입스크립트에서는 미리 선언한 형식에 맞춰 값을 작성해야 하므로
// 정확한 값을 표현하기 위한 추가 함수가 필요 해 졌음 

const emailValidator = (value: unknown) =>
  typeof value === 'string' && isEmail(value);

export const CreateUser = s.object({
  email: s.define('email', emailValidator),
  nickname: s.size(s.string(), 1, 30),
  password: s.size(s.string(), 8, 20),
});
