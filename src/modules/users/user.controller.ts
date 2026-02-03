import { UserCreateDto } from '../users/user.dto';
import { BadRequestError } from '../../libs/error';
import { ArticleRepogitory } from '../articles/article.repository';
import { LikeRepository } from '../likes/like.repository';
import { ProductRepository } from '../products/product.repository';
import { UserRepository } from '../users/user.repository';
import { ArticleService } from '../articles/article.service';
import { LikeService } from '../likes/like.service';
import { ProductService } from '../products/product.service';
import { UserService } from '../users/user.service';
import { NotificationRepository } from '../notifications/notification.repository';
import { NotificationService } from '../notifications/notification.service';
import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../../libs/constants';

export class UserController {
  constructor(
    private service: UserService,
    private productService: ProductService,
    private articleService: ArticleService,
    private likeService: LikeService
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    const userDto: UserCreateDto = req.validatedUserCreate!;
    const data = await this.service.createUser(userDto);
    res.status(201).json(data);
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.validatedUserLogin!;
    const user = await this.service.getUser(email, password);

    const accessToken = await this.service.createToken(user);
    const refreshToken = await this.service.createToken(user, 'refresh');

    await this.service.updateRefreshToken(email, refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: '로그인 성공' });
  }

  async newRefreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;
    const { userId } = req.auth!;

    const { accessToken, newRefreshToken } = await this.service.refreshToken(
      userId,
      refreshToken
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Refresh 성공' });
  }

  async logOutUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.auth!;

    // 쿠키 삭제
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // DB refreshToken 삭제
    await this.service.logOutUser(userId);

    res.status(200).json({ message: '로그아웃 성공' });
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user!;
    const data = await this.service.getUserProfile(id);
    res.status(200).json(data);
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user!;
    const { nickname, image, password, newPassword } = req.validatedUserUpdate!;

    const updateData: any = { nickname, image }; // password는 Service에서 처리
    const passwordChange =
      password && newPassword
        ? { oldPassword: password, newPassword }
        : undefined;

    const updatedUser = await this.service.updateUserProfile(
      id,
      updateData,
      passwordChange
    );

    if (passwordChange) {
      const newAccessToken = await this.service.createToken(updatedUser);
      const newRefreshToken = await this.service.createToken(
        updatedUser,
        'refresh'
      );

      await this.service.updateUserRefreshToken(id, newRefreshToken);

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
      });
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    const formattedData =
      await this.service.filterSensitiveUserData(updatedUser);
    res.status(200).json(formattedData);
  }

  async getUserProducts(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user!;
    const products = await this.productService.getUserProducts(id);
    res.status(200).json(products);
  }

  async getUserArticles(req: Request, res: Response) {
    const { id } = req.user!;
    const articles = await this.articleService.getUserArticles(id);
    res.status(200).json(articles);
  }

  async likeProductButton(req: Request, res: Response) {
    const userId = req.user!.id;
    const { productId } = req.validatedProductId!;
    if (!productId) throw new BadRequestError();

    const message = await this.likeService.toggleProductLike(userId, productId);
    return res.status(200).json({ message });
  }

  async likeArticleButton(req: Request, res: Response) {
    const userId = req.user!.id;
    const { articleId } = req.validatedArticleId!;
    if (!articleId) throw new BadRequestError();

    const message = await this.likeService.toggleArticleLike(userId, articleId);

    return res.status(200).json({ message });
  }

  async likeProductList(req: Request, res: Response) {
    const userId = req.user!.id;
    const products = await this.likeService.getLikedProducts(userId);
    return res.status(200).json(products);
  }

  async likeArticleList(req: Request, res: Response) {
    const userId = req.user!.id;
    const articles = await this.likeService.getLikedArticles(userId);
    return res.status(200).json(articles);
  }
}

const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const articleRepository = new ArticleRepogitory();
const likeRepository = new LikeRepository();

const notificationRepo = new NotificationRepository();
const notificationService = new NotificationService(notificationRepo);
const userService = new UserService(userRepository);
const productService = new ProductService(
  productRepository,
  notificationService
);
const articleService = new ArticleService(articleRepository);
const likeService = new LikeService(likeRepository);

export const userController = new UserController(
  userService,
  productService,
  articleService,
  likeService
);
