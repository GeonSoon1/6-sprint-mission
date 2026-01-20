import * as s from 'superstruct';
import type { Infer } from 'superstruct';

export const CreateComment = s.object({
  content: s.string(),
});

export const PatchComment = s.partial(CreateComment);

export type CreateCommentType = Infer<typeof CreateComment>;
export type PatchCommentType = Infer<typeof PatchComment>;
