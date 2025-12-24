import {
  getArticle,
  getArticleList,
  createArticle,
  patchArticle,
  deleteArticle,
} from './ArticleService.js';
import { Article } from './Article.js';
import {
  getProduct,
  getProductList,
  createProduct,
  patchProduct,
  deleteProduct,
} from './ProductService.js';
import { Product } from './Product.js';
import { ElectronicProduct } from './ElectronicProduct.js';

//Article 관련

//page , pageSize, keyword 로 GET 메소드
console.log(await getArticleList(1, 10, 'any')); //list불러오기

//id로 GET 메소드
const getData = await getArticle(4954); // 특정 article 불러오기
let GetArticle = new Article(
  getData.id,
  getData.title,
  getData.content,
  getData.image,
  getData.createdAt
);
console.log(GetArticle.toJSON()); // private이라 toJson() (객체로 보여주는 함수)로 보여줌

// POST메소드로 만들고 class에 넣어 출력
const createdData = await createArticle(
  '좋은책',
  '좋은내용',
  'https://example.com'
);
let createdArticle = new Article(
  createdData.id,
  createdData.title,
  createdData.content,
  createdData.image,
  createdData.createdAt
);

console.log(createdData);
console.log(createdArticle.toJSON());

// PATCH 메소드로 바꾸기
const patchData = await patchArticle(4954, {
  content: '매우좋은내용',
});
console.log(patchData);

// DELETE 메소드로 지우기
await deleteArticle(4800);
console.log(await getArticle(4800)); //오류 발생

//////////////////////////////////////////////////////

//Product 관련

//page , pageSize, keyword 로 GET 메소드 , products 배열에 저장

let products = [];
await getProductList(1, 10, '', products);
for (let key of products) {
  console.log(key.name);
  console.log(key.tags);
}

// getProduct() 활용
const getProductData = await getProduct(2460); // 특정 article 불러오기
console.log(getProductData);

// createProduct() 활용
const createdProductData = await createProduct(
  '무선핸드폰',
  '어디서든 잘터진다',
  '100000',
  '전자제품',
  'https://naver.com'
);
console.log(createdProductData);

// patchProduct() 활용
const patchedProductData = await patchProduct(2508, { name: '강한무선핸드폰' });
console.log(patchedProductData);

// deleteProduct() 활용
await deleteProduct(1988);
console.log(await deleteProduct(1988)); //오류 발생
