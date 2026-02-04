const prisma = {
  product: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  productLike: {
    findMany: jest.fn(),
  },
};

export default prisma;
