const TYPES = {
  // Lib
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  ArticleRepository: Symbol.for('ArticleRepository'),
  LikeRepository: Symbol.for('LikeRepository'),
  ArticleCommentRepository: Symbol.for('ArticleCommentRepository'),
  ProductCommentRepository: Symbol.for('ProductCommentRepository'),
  AuthRepository: Symbol.for('AuthRepository'),

  // Services
  UserService: Symbol.for('UserService'),
  ProductService: Symbol.for('ProductService'),
  ArticleService: Symbol.for('ArticleService'),
  LikeService: Symbol.for('LikeService'),
  ArticleCommentService: Symbol.for('ArticleCommentService'),
  ProductCommentService: Symbol.for('ProductCommentService'),
  AuthService: Symbol.for('AuthService'),

  // Controllers
  UserController: Symbol.for('UserController'),
  ProductController: Symbol.for('ProductController'),
  ArticleController: Symbol.for('ArticleController'),
  LikeController: Symbol.for('LikeController'),
  ArticleCommentController: Symbol.for('ArticleCommentController'),
  ProductCommentController: Symbol.for('ProductCommentController'),
  AuthController: Symbol.for('AuthController'),
};

export { TYPES };
