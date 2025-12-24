import { Product } from './Product.js';
import { ElectronicProduct } from './ElectronicProduct.js';

function dataToClass(arr, data) {
  console.log(data);
  for (let item of data.list) {
    if (item.tags.includes('전자제품')) {
      arr.push(
        new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images
        )
      );
    } else {
      arr.push(
        new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images
        )
      );
    }
  }
}

export async function getProductList(page, pageSize, keyword, arr) {
  let res;
  try {
    res = await fetch(
      `https://panda-market-api-crud.vercel.app/products?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword${keyword}`
    );
  } catch (error) {
    console.error(error);
    throw new Error('네트워크 전송 오류');
  }
  if (!res.ok) {
    throw new Error('생성 오류 발생');
  }

  let data;

  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    throw new Error('JSON 파싱 오류');
  }
  await dataToClass(arr, data);
  return data;
}

export async function getProduct(id) {
  let res;
  try {
    res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`
    );
  } catch (error) {
    console.error(error);
    throw new Error('네트워크 전송 오류');
  }
  if (!res.ok) {
    throw new Error('생성 오류 발생');
  }

  let data;

  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    throw new Error('JSON 파싱 오류');
  }

  return data;
}

export async function createProduct(name, description, price, tags, images) {
  const articleData = {
    images: `${images}`,
    tags: `${tags}`,
    price: `${price}`,
    description: `${description}`,
    name: `${name}`,
  };

  let res;

  try {
    res = await fetch('https://panda-market-api-crud.vercel.app/products', {
      method: 'POST',
      body: JSON.stringify(articleData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('네트워크 전송 중 오류 발생');
  }

  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    throw new Error('JSON 파싱 중 오류');
  }

  return data;
}

export async function patchProduct(id, articleData) {
  let res;
  try {
    res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(articleData),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error('네트워크 전송 오류');
  }
  if (!res.ok) {
    throw new Error('생성 오류 발생');
  }

  let data;

  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    throw new Error('JSON 파싱 오류');
  }

  return data;
}

export async function deleteProduct(id) {
  let res;
  try {
    res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error('네트워크 전송 오류');
  }
  if (!res.ok) {
    throw new Error('생성 오류 발생');
  }

  let data;

  try {
    data = await res.json();
  } catch (error) {
    console.error(error);
    throw new Error('JSON 파싱 오류');
  }

  return data;
}
