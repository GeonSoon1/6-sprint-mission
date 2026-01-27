import * as s from "superstruct";
import isEmail from "is-email";

export const RegisterBodyStruct = s.object({
  email: s.nonempty(
    s.coerce(s.define("Email", isEmail), s.string(), (v) => v.trim())
  ),
  nickname: s.nonempty(
    s.coerce(s.size(s.string(), 1, 20), s.string(), (v) => v.trim())
  ),
  password: s.nonempty(s.size(s.string(), 2, 10)),
});

export const LoginBodyStruct = s.object({
  email: s.nonempty(
    s.coerce(s.define("Email", isEmail), s.string(), (v) => v.trim())
  ),
  password: s.nonempty(s.size(s.string(), 2, 10)),
});

export const UpdateUserBodyStruct = s.partial(RegisterBodyStruct);

