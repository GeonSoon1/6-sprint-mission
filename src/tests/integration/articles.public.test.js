import { jest } from "@jest/globals";
import request from "supertest";

const getArticle = jest.fn();

jest.unstable_mockModule("../../services/article.service.js", () => ({
  createArticle: jest.fn(),
  getArticle,
  updateArticle: jest.fn(),
  deleteArticle: jest.fn(),
  getMyArticle: jest.fn(),
}));

const { default: app } = await import("../../app.js");

describe("GET /articles/:id (public)", () => {
  test("로그인 없이 단건 조회 가능", async () => {
    getArticle.mockResolvedValue({
      id: 1,
      title: "테스트글",
      content: "내용",
      imageUrl: [],
    });

    const res = await request(app).get("/articles/1");

    expect(res.status).toBe(200);
    expect(getArticle).toHaveBeenCalledWith(1);
    expect(res.body).toEqual(expect.objectContaining({ id: 1, title: "테스트글" }));
  });
});
