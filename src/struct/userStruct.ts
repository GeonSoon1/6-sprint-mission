import * as s from 'superstruct';
import { CreateCommentDto } from '../dto/dto';

export const CreateUser = s.object({
  email: s.string(),
  nickname: s.string(),
  image: s.optional(s.string()),
  password: s.string() // hashed
});

export const PatchUser = s.partial(CreateUser);
