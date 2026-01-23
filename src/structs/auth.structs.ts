import { nonempty, nullable, object, string, refine } from 'superstruct';
import isEmail from 'is-email';

const EmailStruct = refine(string(), 'Email', (value) => isEmail(value));

export const RegisterBodyStruct = object({
  email: nonempty(EmailStruct),
  nickname: nonempty(string()),
  password: nonempty(string()),
  image: nullable(string()),
});

export const LoginBodyStruct = object({
  email: nonempty(EmailStruct),
  password: nonempty(string()),
});
