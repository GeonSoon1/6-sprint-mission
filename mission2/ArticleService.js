import { Article } from './Article.js';
import axios from 'axios';
const instance = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app',
  timeout: 5000,
});

export async function getArticleListAxios(queryPrams = {}) {
  let res;
  try {
    res = await instance.get(`/articles`, {
      params: queryPrams,
    });
  } catch (e) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
      throw new Error('생성 오류 발생');
    } else if (e.request) {
      console.log('리퀘스트는 전송되었으나 응답이 오지않음');
    } else {
      console.log('그 외 오류');
    }
  }
  return res.data;
}

export async function getArticleAxios(id) {
  let res;
  try {
    res = await instance.get(`/articles${id}`);
  } catch (e) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
      throw new Error('생성 오류 발생');
    } else if (e.request) {
      console.log('리퀘스트는 전송되었으나 응답이 오지않음');
    } else {
      console.log('그 외 오류');
    }
  }
  return res.data;
}

export async function createArticleAxios(surveyData) {
  let res;
  try {
    res = await instance.post(`/articles`, surveyData);
  } catch (e) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
      throw new Error('생성 오류 발생');
    } else if (e.request) {
      console.log('리퀘스트는 전송되었으나 응답이 오지않음');
    } else {
      console.log('그 외 오류');
    }
  }
  return res.data;
}

export function getArticleList(page, pageSize, keyword) {
  const res = fetch(
    `https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword${keyword}`
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return res;
}

export function getArticle(id) {
  const res = fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return res;
}

export function createArticle(title, content, image) {
  const articleData = {
    image: `${image}`,
    content: `${content}`,
    title: `${title}`,
  };

  return fetch('https://panda-market-api-crud.vercel.app/articles', {
    method: 'POST',
    body: JSON.stringify(articleData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((errText) => {
          throw new Error(`생성 오류 발생: ${res.status} ${errText}`);
        });
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      if (error.name === 'TypeError') {
        throw new Error('네트워크 전송 중 오류 발생');
      }
      throw error;
    });
}

export function patchArticle(id, articleData) {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('생성 오류 발생');
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      if (error.name === 'TypeError') {
        throw new Error('네트워크 전송 중 오류 발생');
      }
      throw error;
    });
}

export function deleteArticle(id) {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('생성 오류 발생');
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      throw new Error('JSON 파싱 오류 발생');
    });
}
