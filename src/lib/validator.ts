import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { prisma } from '@lib'; // export된 prisma 인스턴스를 가져옵니다.

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
