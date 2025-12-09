import * as s from 'superstruct';
import isEmail from 'is-email';

export const CreateUserBodyStruct = s.object({
  email: s.refine(s.string(), 'invalid email', (value) => isEmail(value)),

  nickname: s.nonempty(s.string()),
  password: s.nonempty(s.string()),
  image: s.nullable(s.string()),
});

export const UpdateUserBodyStruct = s.partial(CreateUserBodyStruct);
