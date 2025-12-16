import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}
