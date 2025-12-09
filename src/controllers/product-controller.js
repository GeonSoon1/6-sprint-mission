// TODO) Product-Controller: 요청 처리
// &) Service Import
import { productService } from '../services/product-service.js';

export const productController = {
  // ?) 상품 목록 조회
  async list(req, res) {
    const products = await productService.list(req.query);

    res.status(200).json({
      success: true,
      message: '상품 목록 조회 성공',
      data: products,
    });
  },

  // ?) 상품 조회
  async detail(req, res) {
    const product = await productService.getOrThrow(req.params.id);
    const liked =
      req.user && req.user.id
        ? await productService.isLiked(req.user.id, product.id)
        : false;

    res.status(200).json({
      success: true,
      message: '상품 조회 성공',
      data: { ...product, isLiked: liked },
    });
  },

  // ?) 상품 생성
  async create(req, res) {
    const product = await productService.create(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: '상품이 등록되었습니다',
      data: product,
    });
  },

  // ?) 상품 수정
  async update(req, res) {
    const product = await productService.update(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: '상품이 수정되었습니다',
      data: product,
    });
  },

  // ?) 상품 삭제
  async remove(req, res) {
    await productService.remove(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: '상품이 삭제되었습니다',
    });
  },

  // ?) 상품 구매
  async purchase(req, res) {
    const { productId, quantity } = req.body;
    const result = await productService.purchase(productId, quantity);

    res.status(201).json({
      success: true,
      message: '상품 구매가 완료되었습니다',
      data: result,
    });
  },
};
