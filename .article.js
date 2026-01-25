// article.js
// Article 클래스를 정의합니다.

export class Article {
  _likeCount = 0;
  _favoriteCount = 0;
  _createdAt = null;

  constructor(title, content, writer) {
    // 필수 파라미터 유효성 검사
    if (!title || typeof title !== "string") {
      throw new Error("title is required and must be a string");
    }
    if (!content || typeof content !== "string") {
      throw new Error("content is required and must be a string");
    }
    if (!writer || typeof writer !== "string") {
      throw new Error("writer is required and must be a string");
    }

    this._title = title;
    this._content = content;
    this._writer = writer;
    this._createdAt = new Date(); // 생성 시점의 현재 시간 저장 (읽기 전용)
  }

  get title() {
    return this._title;
  }

  get content() {
    return this._content;
  }

  get writer() {
    return this._writer;
  }

  get likeCount() {
    return this._likeCount;
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  get createdAt() {
    // 읽기 전용: 생성 시간은 변경 불가
    return this._createdAt;
  }

  like() {
    this._likeCount++;
  }

  favorite() {
    this._favoriteCount++;
  }
}
