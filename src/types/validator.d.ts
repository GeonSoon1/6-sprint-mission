import { ClassConstructor } from 'class-transformer';

export interface ValidationSchemas {
  body?: ClassConstructor<object>;
  params?: ClassConstructor<object>;
  query?: ClassConstructor<object>;
}
