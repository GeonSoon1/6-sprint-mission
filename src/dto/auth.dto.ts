import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { User } from '@prisma/client';
import { IsEmailUnique, IsNicknameUnique } from '@lib';

export class SignUpDTO {
  @IsNotEmpty({ message: '이메일 주소를 입력해주세요.' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsEmailUnique() // 이미 사용 중인 이메일 입니다.
  email!: User['email'];

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(4, { message: '비밀번호를 4자 이상 입력해주세요.' })
  password!: User['password'];

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @MinLength(2, { message: '2자 이상 입력해주세요.' })
  @IsNicknameUnique() // 이미 사용 중인 닉네임입니다.
  nickname!: User['nickname'];

  @IsString()
  @IsOptional()
  address?: User['address'];
}

export class AuthDTO {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email!: User['email'];

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password!: User['password'];
}
