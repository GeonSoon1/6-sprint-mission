// TODO) Article-Validator: 유효성 검사
import * as s from 'superstruct';

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 300),
});

export const PatchArticle = s.partial(CreateArticle);
