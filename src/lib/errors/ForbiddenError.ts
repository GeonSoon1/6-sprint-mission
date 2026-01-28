import { BaseError } from '@lib';

export class ForbiddenError extends BaseError {
  constructor(message = '접근권한이 없습니다.') {
    super(message, 403);
  }
}
