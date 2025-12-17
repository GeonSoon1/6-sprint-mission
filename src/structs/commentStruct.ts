import * as s from 'superstruct';

export const CreateComment = s.object({
  content: s.string(),
});

export const PatchComment = s.partial(CreateComment);
