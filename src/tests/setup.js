import { jest } from "@jest/globals";

// 테스트 환경 변수 기본값
process.env.NODE_ENV = "test";
process.env.JWT_ACCESS_TOKEN_SECRET ||= "test-access-secret";
process.env.JWT_REFRESH_TOKEN_SECRET ||= "test-refresh-secret";

// 콘솔 로그 너무 많으면 테스트 출력이 지저분해져서 잠깐 막음
jest.spyOn(console, "log").mockImplementation(() => {});

afterAll(() => {
  console.log.mockRestore?.();
});
