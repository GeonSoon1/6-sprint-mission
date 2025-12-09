// TODO) Product-Validator: 유효성 검사
import * as s from 'superstruct';
import { Tag } from '@prisma/client';

// ?) 스키마 참조
const TAGS = Object.values(Tag);

const ImagePath = s.optional(
  s.refine(s.string(), 'imagePathExt', (value) =>
    /\.(jpe?g|png)$/i.test(value)
  )
);

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 20),
  description: s.optional(s.string()),
  price: s.min(s.number(), 0),
  stock: s.min(s.integer(), 0),
  tags: s.enums(TAGS),
  imagePath: ImagePath,
});

export const PatchProduct = s.partial(CreateProduct);
