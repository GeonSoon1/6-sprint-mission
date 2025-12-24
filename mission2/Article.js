import { patchArticle } from './ArticleService.js';

export class Article {
  #id;
  #title;
  #content;
  #image;
  #writer;
  #likeCount;
  #createdAt;
  constructor(
    id,
    title,
    content,
    image,
    createdAt = new Date(),
    likeCount = 0
  ) {
    this.#id = id;
    this.#title = title;
    this.#content = content;
    this.#image = image;
    this.#writer = '';
    this.#likeCount = likeCount;
    this.#createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      content: this.#content,
      image: this.#image,
      writer: this.#writer,
      likeCount: this.#likeCount,
      createdAt: this.#createdAt,
    };
  }
  
  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }
  get content() {
    return this.#content;
  }
  get image() {
    return this.#image;
  }
  get writer() {
    return this.#writer;
  }
  get likeCount() {
    return this.#likeCount;
  }
  get createdAt() {
    return this.#createdAt;
  }

  set id(id) {
    this.#id = id;
  }
  set title(title) {
    this.#title = title;
  }
  set content(content) {
    this.#content = content;
  }
  set image(image) {
    this.#image = image;
  }
  set title(writer) {
    this.#writer = writer;
  }

  like() {
    this.#likeCount++;
    // patchArticle(this.#id, {
    //   likeCount: `${this.#likeCount}`,
    // });  //body에 likeCount가 없어서 오류 발생
  }
}
