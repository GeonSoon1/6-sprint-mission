import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ProductCommentService } from '@services';
import { TYPES } from '@types';

@injectable()
export class ProductCommentController {
  constructor(
    @inject(TYPES.ProductCommentService)
    private readonly productCommentService: ProductCommentService,
  ) {}

  public createComment = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const authorId = req.user!.id;
    const content = req.body;

    const newProduct = await this.productCommentService.createComment(productId, authorId, content);

    res.status(201).json(newProduct);
  };

  public getCommentsByProductId = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const content = await this.productCommentService.getComments(productId);
    res.status(200).json(content);
  };

  public updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user!.id;
    const content = req.body;

    const updateComment = await this.productCommentService.updateComment(
      commentId,
      authorId,
      content,
    );

    res.status(200).json(updateComment);
  };

  public deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user!.id;

    await this.productCommentService.deleteComment(commentId, authorId);
    res.status(204).send();
  };
}
