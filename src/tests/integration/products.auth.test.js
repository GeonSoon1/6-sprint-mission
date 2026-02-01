import { jest } from "@jest/globals";
import request from "supertest";

const verifyAccessToken = jest.fn(() => ({ userId: 1 }));
const prisma = {
  user: {
    findUnique: jest.fn(async () => ({ id: 1, email: "test@example.com" })),
  },
};

const createProduct = jest.fn();
const updateProduct = jest.fn();

jest.unstable_mockModule("../../lib/token.js", () => ({
  generateTokens: jest.fn(),
  verifyAccessToken,
  verifyRefreshToken: jest.fn(),
}));

jest.unstable_mockModule("../../lib/prisma.js", () => ({ prisma }));

jest.unstable_mockModule("../../services/product.service.js", () => ({
  createProduct,
  getProduct: jest.fn(),
  updateProduct,
  deleteProduct: jest.fn(),
  getMyProduct: jest.fn(),
}));

const { default: app } = await import("../../app.js");

describe("Products (auth required)", () => {
  test("POST /products - 쿠키 없으면 401", async () => {
    const res = await request(app).post("/products").send({
      name: "A",
      description: "B",
      price: 10,
      tags: [],
    });
    expect(res.status).toBe(401);
  });

  test("POST /products - 쿠키 있으면 생성(200)", async () => {
    createProduct.mockResolvedValue({ id: 10, name: "A" });

    const res = await request(app)
      .post("/products")
      .set("Cookie", ["access-token=ANY"])
      .send({
        name: "  상품  ",
        description: "  설명  ",
        price: "1000",
        tags: [" tag1 ", "tag2"],
      });

    expect(res.status).toBe(200);
    expect(verifyAccessToken).toHaveBeenCalled();

    expect(createProduct).toHaveBeenCalledWith(
      {
        name: "상품",
        description: "설명",
        price: 1000,
        tags: ["tag1", "tag2"],
      },
      { id: 1, email: "test@example.com" }
    );
    expect(res.body).toEqual(expect.objectContaining({ id: 10 }));
  });

  test("PATCH /products/:id - 쿠키 있으면 수정(200)", async () => {
    updateProduct.mockResolvedValue({ id: 10, price: 2000 });

    const res = await request(app)
      .patch("/products/10")
      .set("Cookie", ["access-token=ANY"])
      .send({ price: 2000 });

    expect(res.status).toBe(200);
    expect(updateProduct).toHaveBeenCalledWith(
      10,
      { price: 2000 },
      { id: 1, email: "test@example.com" }
    );
  });
});
