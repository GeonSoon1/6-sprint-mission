import request from "supertest";
import app from "../../app.js"; // Express app 인스턴스를 가져옵니다.
import prisma from "../../lib/prisma-client.js"; // Prisma Client (DB 초기화용)

describe("Auth API Integration Tests", () => {
  // 테스트 전후 DB 정리 (필요 시)
  beforeAll(async () => {
    // 예: 테스트용 DB 초기화
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("POST /auth/register - 회원가입 성공", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
        nickname: "Tester",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  test("POST /auth/login - 로그인 성공 및 토큰 발급", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken"); // 토큰 발급 확인
  });
});
