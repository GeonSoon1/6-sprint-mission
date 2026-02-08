// structs/product.struct.js
import * as s from "superstruct";

const TrimmedNonEmptyString = s.nonempty(
  s.coerce(s.string(), s.string(), (v) => v.trim())
);

export const CreateProductBodyStruct = s.object({
  name: s.size(TrimmedNonEmptyString, 1, 30),
  description: s.size(TrimmedNonEmptyString, 1, 100),
  price: s.min(
    s.coerce(s.integer(), s.union([s.string(), s.number()]), (v) => Number(v)),
    0
  ),
  tags: s.size(s.array(s.size(TrimmedNonEmptyString, 1, 30)), 0, 10),
  // S3 업로드 후 저장될 이미지 URL
  imageUrl: s.optional(s.size(TrimmedNonEmptyString, 1, 2048)),
});

export const UpdateProductBodyStruct = s.partial(CreateProductBodyStruct);
