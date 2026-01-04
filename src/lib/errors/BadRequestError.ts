import { BaseError } from './BaseError';

export class BadRequestError extends BaseError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
  }
}
