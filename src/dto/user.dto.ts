import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IsEmailUnique, IsNicknameUnique } from '../lib/validators.ts/user.validator';
import { User } from '@prisma/client';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty({ message: '현재 비밀번호를 입력해주세요.' })
  @MinLength(4, { message: '비밀번호를 4자 이상 입력해주세요.' })
  currentPassword!: User['password'];

  @IsString()
  @IsNotEmpty({ message: '새로운 비밀번호를 입력해주세요.' })
  @MinLength(4, { message: '비밀번호를 4자 이상 입력해주세요.' })
  newPassword!: User['password'];
}

export class UpdateUserDTO {
  @IsNotEmpty({ message: '이메일 주소를 입력해주세요.' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsEmailUnique() // 이미 사용 중인 이메일 입니다.
  @IsOptional()
  email!: User['email'];

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @MinLength(2, { message: '2자 이상 입력해주세요.' })
  @IsNicknameUnique() // 이미 사용 중인 닉네임입니다.
  @IsOptional()
  nickname!: User['nickname'];

  @IsString()
  @IsOptional()
  address?: User['address'];
}

export class UserWithdrawalDTO {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(4, { message: '비밀번호를 4자 이상 입력해주세요.' })
  password!: User['password'];
}
