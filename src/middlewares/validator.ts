import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate, ValidatorOptions } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@lib';
import { ValidationSchemas } from '@types';

import { prisma } from '@lib'; // export된 prisma 인스턴스를 가져옵니다.

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

// --- 이메일 중복 검사 ---
@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return !user; // 유저가 없으면 true (통과)
  }

  defaultMessage() {
    return '이미 사용 중인 이메일 입니다.';
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}

// --- 닉네임 중복 검사 ---
@ValidatorConstraint({ async: true })
export class IsNicknameUniqueConstraint implements ValidatorConstraintInterface {
  async validate(nickname: string) {
    const user = await prisma.user.findUnique({ where: { nickname } });
    return !user; // 유저가 없으면 true (통과)
  }

  defaultMessage() {
    return '이미 사용 중인 닉네임입니다.';
  }
}

export function IsNicknameUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNicknameUniqueConstraint,
    });
  };
}
