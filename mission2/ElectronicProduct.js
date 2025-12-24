import { Product } from './Product.js';
export class ElectronicProduct extends Product {
  #manufacturer;
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer
  ) {
    super(name, description, price, tags, images, favoriteCount);

    this.#manufacturer = manufacturer;
  }

  get manufacturer() {
    return this.#manufacturer;
  }
  set manufacturer(manufacturer) {
    this.#manufacturer = manufacturer;
  }
}
