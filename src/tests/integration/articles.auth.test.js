import { jest } from "@jest/globals";
import request from "supertest";

const verifyAccessToken = jest.fn(() => ({ userId: 1 }));
const prisma = {
  user: {
    findUnique: jest.fn(async () => ({ id: 1, email: "test@example.com" })),
  },
};

const createArticle = jest.fn();
const deleteArticle = jest.fn();

jest.unstable_mockModule("../../lib/token.js", () => ({
  generateTokens: jest.fn(),
  verifyAccessToken,
  verifyRefreshToken: jest.fn(),
}));

jest.unstable_mockModule("../../lib/prisma.js", () => ({ prisma }));

jest.unstable_mockModule("../../services/article.service.js", () => ({
  createArticle,
  getArticle: jest.fn(),
  updateArticle: jest.fn(),
  deleteArticle,
  getMyArticle: jest.fn(),
}));

const { default: app } = await import("../../app.js");

describe("Articles (auth required)", () => {
  test("POST /articles - 쿠키 없으면 401", async () => {
    const res = await request(app).post("/articles").send({
      title: "제목",
      content: "내용",
    });
    expect(res.status).toBe(401);
  });

  test("POST /articles - 쿠키 있으면 생성(200)", async () => {
    createArticle.mockResolvedValue({ id: 1, title: "제목" });

    const res = await request(app)
      .post("/articles")
      .set("Cookie", ["access-token=ANY"])
      .send({
        title: "  제목  ",
        content: "  내용  ",
        // ✅ imageUrl은 보내지 않음 (optional이므로 미전달로 검증 통과)
      });

    expect(res.status).toBe(200);

    // ✅ controller에서 trim이 적용된 값만 필수로 확인
    expect(createArticle).toHaveBeenCalledWith(
      expect.objectContaining({ title: "제목", content: "내용" }),
      { id: 1, email: "test@example.com" }
    );
  });

  test("DELETE /articles/:id - 쿠키 있으면 204", async () => {
    deleteArticle.mockResolvedValue();

    const res = await request(app)
      .delete("/articles/1")
      .set("Cookie", ["access-token=ANY"]);

    expect(res.status).toBe(204);
    expect(deleteArticle).toHaveBeenCalledWith(1, {
      id: 1,
      email: "test@example.com",
    });
  });
});
