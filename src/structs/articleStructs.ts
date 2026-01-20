import * as s from 'superstruct';

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 60),
  content: s.string(),
});

export const PatchArticle = s.partial(CreateArticle);
