import * as s from 'superstruct'

const integerString = s.coerce(
  s.integer(),
  s.union([s.string(), s.number()]),
  (v) => Number(v)
)

export const IdParamsStruct = s.object({
  id : integerString
})
