import { articlesService } from '../services/articlesService.js';

export async function createArticle(req, res) {
  const { title, content } = req.body;
  const userId = req.user.id;

  const newArticle = await articlesService.createArticleInDb(title, content, userId);

  res.status(201).json({
    message: '게시글이 성공적으로 등록되었습니다.',
    data: newArticle,
  });
}

export async function getArticles(req, res) {
  const { sort, search } = req.query;
  const { offset, limit } = req.paginationParams;
  const userId = req.user?.id;

  const { articles, totalArticles } = await articlesService.findArticles(
    {
      sort,
      search,
      offset,
      limit,
    },
    userId,
  );

  if (search && totalArticles === 0) {
    return res.status(200).json({
      message: `${search}와 일치하는 게시물을 찾을 수 없습니다.`,
      data: [],
      pagination: {},
    });
  }

  const totalPages = Math.ceil(totalArticles / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  res.status(200).json({
    message: '게시판 목록을 조회했습니다.',
    data: articles,
    pagination: {
      totalItems: totalArticles,
      totalPages,
      currentPage,
      itemsPerPage: limit,
    },
  });
}

export async function getArticle(req, res) {
  const { id } = req.params;
  const userId = req.user?.id;
  const article = await articlesService.findArticleById(id, userId);

  res.status(200).send(article);
}

export async function patchArticle(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;

  const userId = req.user.id;

  if (Object.keys(updateData).length === 0) {
    const emptyBodyError = new Error('수정할 내용이 비어 있습니다.');
    emptyBodyError.status = 400;
    throw emptyBodyError;
  }

  const article = await articlesService.updateArticleInDb(id, updateData, userId);

  res.status(200).json({
    message: '게시글이 성공적으로 수정되었습니다.',
    data: article,
  });
}

export async function deleteArticle(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const article = await articlesService.deleteArticleInDb(id, userId);

  res.status(200).send(article);
}
