// TODO) Article-Comment-Validator: 유효성 검사
import * as s from 'superstruct';

const Content = s.size(s.string(), 1, 100);

export const CreateArticleComment = s.object({
  articleId: s.integer(),
  content: Content,
});

export const PatchArticleComment = s.object({
  content: Content,
});
