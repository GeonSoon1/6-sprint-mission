import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../lib/errors';
import { ValidationSchemas } from '../types/validator';

const defaultValidatorOptions: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
};

export const validator = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const targets = [
      { key: 'body', dto: schemas.body, options: defaultValidatorOptions },
      { key: 'params', dto: schemas.params, options: {} },
      { key: 'query', dto: schemas.query, options: defaultValidatorOptions },
    ] as const;

    try {
      for (const { key, dto, options } of targets) {
        if (!dto || !req[key] || Object.keys(req[key]).length === 0) {
          continue;
        }
        const instance = plainToInstance(dto, req[key]);

        const errors = await validate(instance, options);

        if (errors.length > 0) {
          const errorMessages = errors
            .map((error) => Object.values(error.constraints || {}))
            .flat();
          throw new BadRequestError(errorMessages.join(', '));
        }
        req[key] = instance;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
