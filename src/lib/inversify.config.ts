import 'reflect-metadata';
import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '@types';

// Repositories
import {
  ArticleCommentRepository,
  ArticleRepository,
  AuthRepository,
  LikeRepository,
  ProductCommentRepository,
  ProductRepository,
  UserRepository,
  NotificationRepository,
} from '@repositories';

// Services
import {
  ArticleCommentService,
  ArticleService,
  AuthService,
  LikeService,
  ProductCommentService,
  ProductService,
  UserService,
  NotificationService,
} from '@services';

// Controllers
import {
  ArticleCommentController,
  ArticleController,
  AuthController,
  LikeController,
  ProductCommentController,
  ProductController,
  UserController,
  NotificationController,
} from '@controllers';

const container = new Container();

// 데이터베이스 클라이언트 (싱글톤으로 바인딩)
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

// Repositories
container
  .bind<ArticleCommentRepository>(TYPES.ArticleCommentRepository)
  .to(ArticleCommentRepository);
container.bind<ArticleRepository>(TYPES.ArticleRepository).to(ArticleRepository);
container.bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository);
container.bind<LikeRepository>(TYPES.LikeRepository).to(LikeRepository);
container
  .bind<ProductCommentRepository>(TYPES.ProductCommentRepository)
  .to(ProductCommentRepository);
container.bind<ProductRepository>(TYPES.ProductRepository).to(ProductRepository);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<NotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);

// Services
container.bind<ArticleCommentService>(TYPES.ArticleCommentService).to(ArticleCommentService);
container.bind<ArticleService>(TYPES.ArticleService).to(ArticleService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<LikeService>(TYPES.LikeService).to(LikeService);
container.bind<ProductCommentService>(TYPES.ProductCommentService).to(ProductCommentService);
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);

// Controllers
container
  .bind<ArticleCommentController>(TYPES.ArticleCommentController)
  .to(ArticleCommentController);
container.bind<ArticleController>(TYPES.ArticleController).to(ArticleController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<LikeController>(TYPES.LikeController).to(LikeController);
container
  .bind<ProductCommentController>(TYPES.ProductCommentController)
  .to(ProductCommentController);
container.bind<ProductController>(TYPES.ProductController).to(ProductController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);

export { container };
