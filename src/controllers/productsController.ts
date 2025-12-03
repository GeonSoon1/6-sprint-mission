import { productsService } from '../services/productsService';
import { getUserIdFromToken } from '../utils/token';

export async function createProduct(req, res) {
  const productData = req.body;
  const userId = req.user.id;

  const newProduct = await productsService.createProductInDb(productData, userId);

  res.status(201).json({
    message: '상품이 성공적으로 등록되었습니다.',
    data: newProduct,
  });
}

export async function getProducts(req, res) {
  const { sort, search } = req.query;
  const { offset: _offset, limit: _limit } = req.paginationParams;

  const userId = getUserIdFromToken(req);

  const { products, totalProducts } = await productsService.findProducts(
    {
      sort,
      search,
      offset: _offset,
      limit: _limit,
    },
    userId,
  );

  if (search && totalProducts === 0) {
    return res.status(200).json({
      message: `${search}와 일치하는 상품을 찾을 수 없습니다.`,
      data: [],
      pagination: {},
    });
  }

  const totalPages = Math.ceil(totalProducts / _limit);

  res.status(200).json({
    message: '상품 목록을 조회했습니다.',
    data: products,
    pagination: {
      totalItems: totalProducts,
      totalPages: totalPages,
      currentPage: Math.floor(_offset / _limit) + 1,
      itemsPerPage: _limit,
    },
  });
}

export async function getProduct(req, res) {
  const { id } = req.params;
  const userId = getUserIdFromToken(req);
  const product = await productsService.findProductById(id, userId);

  res.status(200).send(product);
}

export async function patchProduct(req, res) {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user.id;

  if (Object.keys(updateData).length === 0) {
    const emptyBodyError = new Error('수정할 내용이 비어 있습니다.');
    emptyBodyError.status = 400;
    throw emptyBodyError;
  }

  const product = await productsService.updateProductInDb(id, updateData, userId);

  res.status(200).json({
    message: '상품이 성공적으로 수정되었습니다.',
    data: product,
  });
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const product = await productsService.deleteProductInDb(id, userId);

  res.status(204).send(product);
}
