import * as s from 'superstruct';
import isEmail from 'is-email';

export const CreateUser = s.object({
  email: s.define('email', isEmail),
  nickname: s.size(s.string(), 2, 30),
  password: s.size(s.string(), 4, 20),
});

export const UserLogin = s.object({
  email: s.define('email', isEmail),
  password: s.string(),
});

export const PatchUser = s.partial(CreateUser);
