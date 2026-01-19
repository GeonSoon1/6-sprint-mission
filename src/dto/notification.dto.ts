import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Notification } from '@prisma/client';

export class NotificationDTO {
  @IsString()
  @IsNotEmpty({ message: '메시지 제목이 없습니다.' })
  title!: Notification['title'];

  @IsString()
  @IsNotEmpty({ message: '메시지 내용이 없습니다.' })
  content!: Notification['content'];

  @IsString()
  @IsNotEmpty({ message: '메시지 타입을 선택해주세요.' })
  type!: Notification['type'];

  @IsString()
  @IsOptional()
  link?: Notification['link'];
}
