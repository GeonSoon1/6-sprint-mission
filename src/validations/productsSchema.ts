import * as s from 'superstruct';

export const CreateProductSchema = s.object({
  name: s.size(s.string(), 1, 60),
  description: s.string(),
  price: s.min(s.number(), 0),
  tags: s.array(s.string()),
});

export const PatchProductSchema = s.partial(CreateProductSchema);
