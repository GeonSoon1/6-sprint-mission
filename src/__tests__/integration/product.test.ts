import request from "supertest";
import app from "../../app.js";

describe("Product API Integration Tests", () => {
  let userToken: string;

  beforeAll(async () => {
    // 로그인하여 토큰 미리 확보
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    userToken = loginRes.body.accessToken;
  });

  // [기본] 인증 불필요: 상품 목록 조회
  test("GET /products - 전체 상품 조회 (인증 불필요)", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // [기본] 인증 필요: 상품 생성
  test("POST /products - 상품 생성 (인증 필요)", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${userToken}`) // 토큰 헤더 설정
      .send({ name: "New Product", price: 10000 });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("New Product");
  });

  // [기본] 인증 실패 케이스
  test("POST /products - 토큰 없이 요청 시 실패", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "Fail Product", price: 10000 });

    expect(res.statusCode).toBe(401); // Unauthorized
  });
});
