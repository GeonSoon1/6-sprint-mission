import * as s from 'superstruct';
import type { Infer } from 'superstruct';

export const CreateArticle = s.object({
  title: s.string(),
  content: s.string(),
});

export const PatchArticle = s.partial(CreateArticle);
