import { create } from 'superstruct';
import { articleService } from '../services/articleService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { CreateArticleBodyStruct, UpdateArticleBodyStruct, GetArticleListParamsStruct, } from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
export async function createArticle(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const data = create(req.body, CreateArticleBodyStruct);
    const article = await articleService.createArticle(req.user.id, data);
    res.status(201).send(article);
}
export async function getArticle(req, res) {
    const { id } = create(req.params, IdParamsStruct);
    const article = await articleService.getArticle(id, req.user?.id);
    res.send(article);
}
export async function updateArticle(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id } = create(req.params, IdParamsStruct);
    const data = create(req.body, UpdateArticleBodyStruct);
    const updatedArticle = await articleService.updateArticle(id, req.user.id, data);
    res.send(updatedArticle);
}
export async function deleteArticle(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id } = create(req.params, IdParamsStruct);
    await articleService.deleteArticle(id, req.user.id);
    res.status(204).send();
}
export async function getArticleList(req, res) {
    const query = create(req.query, GetArticleListParamsStruct);
    const result = await articleService.getArticleList(query, req.user?.id);
    res.send(result);
}
export async function createComment(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id: articleId } = create(req.params, IdParamsStruct);
    const data = create(req.body, CreateCommentBodyStruct);
    const createdComment = await articleService.createComment(articleId, req.user.id, data);
    res.status(201).send(createdComment);
}
export async function getCommentList(req, res) {
    const { id: articleId } = create(req.params, IdParamsStruct);
    const query = create(req.query, GetCommentListParamsStruct);
    const result = await articleService.getCommentList(articleId, query);
    res.send(result);
}
export async function createLike(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id: articleId } = create(req.params, IdParamsStruct);
    await articleService.createLike(articleId, req.user.id);
    res.status(201).send();
}
export async function deleteLike(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id: articleId } = create(req.params, IdParamsStruct);
    await articleService.deleteLike(articleId, req.user.id);
    res.status(204).send();
}
//# sourceMappingURL=articlesController.js.map