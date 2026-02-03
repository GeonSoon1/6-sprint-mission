import { jest } from "@jest/globals";

const productRepo = {
  createProduct: jest.fn(),
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getMyProduct: jest.fn(),
};

const userRepo = {
  getUserById: jest.fn(),
};

const productLikeRepo = {
  findProductLike: jest.fn(),
  findLikerUserIds: jest.fn(),
};

const notificationRepo = {
  createManyNotifications: jest.fn(),
};

const ioTo = jest.fn(() => ({ emit: jest.fn() }));
const io = { to: ioTo };
const getIO = jest.fn(() => io);

jest.unstable_mockModule("../../repositories/product.repo.js", () => productRepo);
jest.unstable_mockModule("../../repositories/user.repo.js", () => userRepo);
jest.unstable_mockModule("../../repositories/productLike.repo.js", () => productLikeRepo);
jest.unstable_mockModule("../../repositories/notification.repo.js", () => notificationRepo);
jest.unstable_mockModule("../../socket.js", () => ({
  getIO,
}));

const svc = await import("../../services/product.service.js");
const { getProduct, updateProduct } = svc;

describe("product.service unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getProduct: 비로그인(userId=null)이면 isLiked=false", async () => {
    productRepo.getProductById.mockResolvedValue({ id: 10, name: "A" });

    const result = await getProduct(10, null);

    expect(productRepo.getProductById).toHaveBeenCalledWith(10);
    expect(productLikeRepo.findProductLike).not.toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ id: 10, isLiked: false }));
  });

  test("getProduct: 로그인(userId=1)이면 좋아요 여부 반영", async () => {
    productRepo.getProductById.mockResolvedValue({ id: 10, name: "A" });
    productLikeRepo.findProductLike.mockResolvedValue({ userId: 1, productId: 10 });

    const result = await getProduct(10, 1);

    expect(productLikeRepo.findProductLike).toHaveBeenCalledWith(1, 10);
    expect(result.isLiked).toBe(true);
  });

  test("updateProduct: 가격 변동 시 좋아요 유저(본인 제외)에게 알림 생성 + socket emit", async () => {
    productRepo.getProductById.mockResolvedValue({
      id: 10,
      name: "A",
      price: 1000,
      userId: 1,
    });
    productRepo.updateProduct.mockResolvedValue({ id: 10, price: 2000 });

    productLikeRepo.findLikerUserIds.mockResolvedValue([
      { userId: 1 },
      { userId: 2 },
      { userId: 3 },
    ]);

    const result = await updateProduct(10, { price: 2000 }, { id: 1 });

    expect(productRepo.updateProduct).toHaveBeenCalledWith(10, { price: 2000 });
    expect(notificationRepo.createManyNotifications).toHaveBeenCalledTimes(1);

    const rowsArg = notificationRepo.createManyNotifications.mock.calls[0][0];
    expect(rowsArg).toHaveLength(2); // 본인(1) 제외하고 2명
    expect(rowsArg.map((r) => r.userId)).toEqual([2, 3]);

    expect(getIO).toHaveBeenCalled();
    expect(ioTo).toHaveBeenCalledWith("user:2");
    expect(ioTo).toHaveBeenCalledWith("user:3");

    expect(result).toEqual(expect.objectContaining({ id: 10, price: 2000 }));
  });

  test("updateProduct: 내 상품이 아니면 Forbidden", async () => {
    productRepo.getProductById.mockResolvedValue({ id: 10, userId: 999, price: 1000 });

    await expect(updateProduct(10, { price: 2000 }, { id: 1 })).rejects.toThrow(
      "상품을 수정 할 권한이 없습니다."
    );
  });
});
