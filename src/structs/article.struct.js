import * as s from 'superstruct'

const TrimmedNonEmptyString = s.nonempty(
  s.coerce(s.string(), s.string(), (v) => v.trim())
)

export const CreateArticleBodyStruct = s.object({
  title: s.size(TrimmedNonEmptyString, 1, 50),
  content: s.size(TrimmedNonEmptyString, 1, 100),
  imageUrl: s.optional(s.size(s.array(TrimmedNonEmptyString)), 0, 10),
})

export const UpdateArticleBodyStruct = s.partial(CreateArticleBodyStruct)