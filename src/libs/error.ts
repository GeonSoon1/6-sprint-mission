export class BaseError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = new.target.name; // new.target.name은 현재 생성된 클래스 자체의 이름 문자열을 가져와서 name프로퍼티에 할당
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype); // Object.setPrototypeOf는 Error 상속 시 prototype 문제를 해결함
  }
}

export class NotFoundError extends BaseError {
  constructor(message = '데이터가 존재하지 않습니다.') {
    super(message, 404);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = '비밀번호가 틀렸습니다.') {
    super(message, 403);
  }
}

export class AuthorizeError extends BaseError {
  constructor(message = '접근할 수 없는 권한입니다.') {
    super(message, 401);
  }
}

export class IsSamePasswordError extends BaseError {
  constructor(message = '같은 비밀번호로 변경할 수 없습니다.') {
    super(message, 403);
  }
}
