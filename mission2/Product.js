export class Product {
  #name;
  #description;
  #price;
  #tags;
  #images;
  #favoriteCount;
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount = favoriteCount;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get price() {
    return this.#price;
  }
  get tags() {
    return this.#tags;
  }
  get images() {
    return this.#images;
  }
  get favoriteCount() {
    return this.#favoriteCount;
  }

  set name(newName) {
    this.#name = newName;
  }
  set description(newDescription) {
    this.#description = newDescription;
  }
  set price(newPrice) {
    this.#price = newPrice;
  }
  set tags(newTags) {
    this.#tags = newTags;
  }
  set images(newImages) {
    this.#images = newImages;
  }
  set favoriteCount(newFavoriteCount) {
    this.#favoriteCount = newFavoriteCount;
  }

  getFavoriteCount() {
    this.#favoriteCount += 1;
  }
}
