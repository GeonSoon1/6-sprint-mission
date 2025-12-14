import * as s from 'superstruct';

export const CreateProduct = s.object({
  name: s.string(),
  description: s.string(),
  price: s.number(),
  tags: s.string(),
});

export const PatchProduct = s.partial(CreateProduct);
