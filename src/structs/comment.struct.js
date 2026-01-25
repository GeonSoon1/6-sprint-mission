import * as s from 'superstruct'

const TrimmedNonEmptyString = s.nonempty(
  s.coerce(s.string(), s.string(), (v) => v.trim())
)

export const CreateCommentBodyStruct = s.object({
  content: s.size(TrimmedNonEmptyString, 1, 50),
})

export const UpdateCommentBodyStruct = s.partial(CreateCommentBodyStruct)
