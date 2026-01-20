import * as s from 'superstruct';
import isEmail from 'is-email';

export const patchUser = s.object({
  email: s.optional(s.refine(s.string(), 'email', (value) => isEmail(value))),
  nickname: s.optional(s.size(s.string(), 1, 50)),
  image: s.optional(
    s.nullable(
      s.refine(s.string(), 'url', (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }),
    ),
  ),
});

export const patchUserPassword = s.object({
  currentPassword: s.size(s.string(), 4, 30),
  newPassword: s.size(s.string(), 4, 30),
});
