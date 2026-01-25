// axios.js
// axios 인스턴스를 설정하고 export합니다.

import axios from "axios";

// 기본 axios 인스턴스 생성
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터 (선택사항)
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 전 로깅
    console.log(`[Axios] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (선택사항)
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 성공 시
    return response;
  },
  (error) => {
    // 응답 에러 시
    if (error.response) {
      console.error(
        `[Axios Error] ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      console.error("[Axios Error] No response received");
    } else {
      console.error("[Axios Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
