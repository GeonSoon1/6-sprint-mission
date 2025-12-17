import * as s from "superstruct";
import isEmail from 'is-email';

const email = s.refine(s.string(), 'is_email', (v) => isEmail(v));

export const CreateUser = s.object({
    email: email,
    nickname: s.string(),
    image: s.optional(s.string()),
    password: s.string(),
});


export const PatchUser = s.partial(s.object({
    email: email,
    nickname: s.string(),
    image: s.optional(s.string()),
}));

export const ChangePassword = s.object({
    currentPassword: s.string(),
    newPassword: s.string(),
    confirmNewPassword: s.string(),
});