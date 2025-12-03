import * as s from 'superstruct';

export const CreateArticleSchema = s.object({
  title: s.size(s.string(), 1, 100),
  content: s.size(s.string(), 10, 1000),
});

export const PatchArticleSchema = s.partial(CreateArticleSchema);
