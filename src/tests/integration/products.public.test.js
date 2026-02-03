import { jest } from "@jest/globals";
import request from "supertest";

const getProduct = jest.fn();

jest.unstable_mockModule("../../services/product.service.js", () => ({
  createProduct: jest.fn(),
  getProduct,
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getMyProduct: jest.fn(),
}));

const { default: app } = await import("../../app.js");

describe("GET /products/:id (public)", () => {
  test("로그인 없이 단건 조회 가능하고, userId는 null로 전달된다", async () => {
    getProduct.mockResolvedValue({
      id: 1,
      name: "테스트상품",
      description: "설명",
      price: 1000,
      tags: [],
      image: [],
      isLiked: false,
    });

    const res = await request(app).get("/products/1");

    expect(res.status).toBe(200);
    expect(getProduct).toHaveBeenCalledWith(1, null);
    expect(res.body).toEqual(
      expect.objectContaining({ id: 1, isLiked: false, name: "테스트상품" })
    );
  });
});
