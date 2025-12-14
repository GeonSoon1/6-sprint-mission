import * as s from 'superstruct';

export const CreateArticle = s.object({
  title: s.string(),
  content: s.string(),
});

export const PatchArticle = s.partial(CreateArticle);
