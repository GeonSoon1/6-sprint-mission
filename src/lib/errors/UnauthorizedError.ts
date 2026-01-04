import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  constructor(message = '인증이 필요합니다. ') {
    super(message, 401);
  }
}
