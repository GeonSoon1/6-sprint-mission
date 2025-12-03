export class NotFoundError extends Error {
  constructor(message = '데이터가 존재하지 않습니다.') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  constructor(message = '잘못된 요청입니다.') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

export class ForbiddenError extends Error {
  constructor(message = '비밀번호가 틀렸습니다.') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

export class AuthorizeError extends Error {
  constructor(message = '접근할 수 없는 권한입니다.') {
    super(message);
    this.name = 'AuthorizeError';
    this.statusCode = 403;
  }
}

export class SamePasswordError extends Error {
  constructor(message = '같은 비밀번호로 변경할 수 없습니다.') {
    super(message);
    this.name = 'samePasswordError';
    this.statusCode = 403;
  }
}
