// TODO) Article-Controller: 요청 처리
// &) Service Import
import { articleService } from '../services/article-service.js';

export const articleController = {
  // ?) 게시글 목록 조회
  async list(req, res) {
    const articles = await articleService.list(req.query);

    res.status(200).json({
      success: true,
      message: '게시글 목록 조회 성공',
      data: articles,
    });
  },

  // ?) 게시글 조회
  async detail(req, res) {
    const article = await articleService.getOrThrow(req.params.id);
    const liked =
      req.user && req.user.id
        ? await articleService.isLiked(req.user.id, article.id)
        : false;

    res.status(200).json({
      success: true,
      message: '게시글 조회 성공',
      data: { ...article, isLiked: liked },
    });
  },
  
  // ?) 게시글 생성
  async create(req, res) {
    const article = await articleService.create(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: '게시글이 등록되었습니다',
      data: article,
    });
  },

  // ?) 게시글 수정
  async update(req, res) {
    const article = await articleService.update(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: '게시글이 수정되었습니다',
      data: article,
    });
  },

  // ?) 게시글 삭제
  async remove(req, res) {
    await articleService.remove(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: '게시글이 삭제되었습니다',
    });
  },
};
