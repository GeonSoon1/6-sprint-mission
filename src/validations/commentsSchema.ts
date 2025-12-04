import * as s from 'superstruct';
import isUUID from 'is-uuid';

export const UUID = s.define('UUID', (value) => typeof value === 'string' && isUUID.v4(value));

export const CreateCommentSchema = s.object({
  content: s.size(s.string(), 1, 500),
});

export const PatchCommentSchema = s.partial(CreateCommentSchema);

export const CommentParamsSchema = s.object({
  commentId: UUID,
});
