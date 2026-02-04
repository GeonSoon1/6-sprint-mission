import articleService from '../../service/articleService';
import articleRepository from '../../repository/articleRepository';
import NotFoundError from '../../lib/errors/NotFoundError';
import ForbiddenError from '../../lib/errors/ForbiddenError';
import ValidationError from '../../lib/errors/ValidationError';

jest.mock('../../repository/articleRepository', () => ({
  findMany: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
}));

describe('ArticleService.createArticle', () => {
  test('게시글 생성에 성공한다', async () => {
    const mockArticle = {
      id: 1,
      title: 'test',
      content: 'content',
      userId: 1,
    };

    (articleRepository.create as jest.Mock).mockResolvedValue(mockArticle);

    const result = await articleService.createArticle({
      title: 'test',
      content: 'content',
      userId: 1,
    });

    expect(articleRepository.create).toHaveBeenCalledWith({
      title: 'test',
      content: 'content',
      userId: 1,
    });
    expect(result).toEqual(mockArticle);
  });
});
describe('ArticleService.getArticleById', () => {
  test('게시글 조회 성공', async () => {
    const mockArticle = { id: 1, userId: 1 };

    (articleRepository.findById as jest.Mock).mockResolvedValue(mockArticle);

    const result = await articleService.getArticleById(1);

    expect(result).toEqual(mockArticle);
  });

  test('게시글이 없으면 NotFoundError 발생', async () => {
    (articleRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(articleService.getArticleById(999)).rejects.toThrow(NotFoundError);
  });
});
describe('ArticleService.updateArticle', () => {
  test('게시글 수정 성공', async () => {
    const article = { id: 1, userId: 1 };
    const updated = { ...article, title: 'updated' };

    (articleRepository.findById as jest.Mock).mockResolvedValue(article);
    (articleRepository.update as jest.Mock).mockResolvedValue(updated);

    const result = await articleService.updateArticle(1, { title: 'updated' }, 1);

    expect(articleRepository.update).toHaveBeenCalledWith(1, { title: 'updated' });
    expect(result).toEqual(updated);
  });

  test('작성자가 아니면 ForbiddenError', async () => {
    (articleRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 2,
    });

    await expect(articleService.updateArticle(1, { title: 'x' }, 1)).rejects.toThrow(
      ForbiddenError,
    );
  });

  test('게시글이 없으면 NotFoundError', async () => {
    (articleRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(articleService.updateArticle(1, {}, 1)).rejects.toThrow(NotFoundError);
  });
});
describe('ArticleService.deleteArticle', () => {
  test('게시글 삭제 성공', async () => {
    (articleRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 1,
    });
    (articleRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await articleService.deleteArticle(1, 1);

    expect(articleRepository.delete).toHaveBeenCalledWith(1);
  });

  test('다른 유저면 ForbiddenError', async () => {
    (articleRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 2,
    });

    await expect(articleService.deleteArticle(1, 1)).rejects.toThrow(ForbiddenError);
  });
});
