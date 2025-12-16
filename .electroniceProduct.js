// electronicProduct.js
// ElectronicProduct 클래스를 정의합니다.

import { Product } from "./.product.js";

export class ElectronicProduct extends Product {
  _manufacturer;

  constructor({
    name,
    description,
    price,
    tags = [],
    images = [],
    favoriteCount = 0,
    manufacturer,
  }) {
    super({ name, description, price, tags, images, favoriteCount });

    this._manufacturer = manufacturer;
  }
  getManufacturer() {
    return this._manufacturer;
  }
  // 다형성: 오버라이드
  summary() {
    return `[전자제품] ${this.getName()} (${this.getManufacturer()}) - ${this.getPrice()}원`;
  }
}
