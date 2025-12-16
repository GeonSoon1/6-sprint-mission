// product.js
// Product 클래스를 정의합니다.

// 추상화/캡슐화: 프라이빗 필드(_)로 내부 상태 보호, 메서드로만 조작
export class Product {
  constructor({
    name,
    description,
    price,
    tags = [],
    images = [],
    favoriteCount = 0,
  }) {
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = Array.from(tags);
    this._images = Array.from(images);
    this._favoriteCount = favoriteCount;
  }
  getName() {
    return this._name;
  }

  getDescription() {
    return this._description;
  }

  getPrice() {
    return this._price;
  }

  getTags() {
    return Array.from(this._tags);
  }

  getImages() {
    return Array.from(this._images);
  }

  getFavoriteCount() {
    return this._favoriteCount;
  }

  favorite() {
    this._favoriteCount += 1;
  }

  // 다형성: 공통 요약
  summary() {
    return `[상품] ${this.getName()} - ${this.getPrice()}원`;
  }
}
