"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const error_1 = require("../../libs/error");
const article_repository_1 = require("../articles/article.repository");
const like_repository_1 = require("../likes/like.repository");
const product_repository_1 = require("../products/product.repository");
const user_repository_1 = require("../users/user.repository");
const article_service_1 = require("../articles/article.service");
const like_service_1 = require("../likes/like.service");
const product_service_1 = require("../products/product.service");
const user_service_1 = require("../users/user.service");
const notification_repository_1 = require("../notifications/notification.repository");
const notification_service_1 = require("../notifications/notification.service");
const constants_1 = require("../../libs/constants");
class UserController {
    service;
    productService;
    articleService;
    likeService;
    constructor(service, productService, articleService, likeService) {
        this.service = service;
        this.productService = productService;
        this.articleService = articleService;
        this.likeService = likeService;
    }
    async createUser(req, res, next) {
        const userDto = req.validatedUserCreate;
        const data = await this.service.createUser(userDto);
        res.status(201).json(data);
    }
    async loginUser(req, res, next) {
        const { email, password } = req.validatedUserLogin;
        const user = await this.service.getUser(email, password);
        const accessToken = await this.service.createToken(user);
        const refreshToken = await this.service.createToken(user, 'refresh');
        await this.service.updateRefreshToken(email, refreshToken);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.status(200).json({ message: '로그인 성공' });
    }
    async newRefreshToken(req, res, next) {
        const { refreshToken } = req.cookies;
        const { userId } = req.auth;
        const { accessToken, newRefreshToken } = await this.service.refreshToken(userId, refreshToken);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.status(200).json({ message: 'Refresh 성공' });
    }
    async logOutUser(req, res, next) {
        const { userId } = req.auth;
        // 쿠키 삭제
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        // DB refreshToken 삭제
        await this.service.logOutUser(userId);
        res.status(200).json({ message: '로그아웃 성공' });
    }
    async getUserProfile(req, res, next) {
        const { id } = req.user;
        const data = await this.service.getUserProfile(id);
        res.status(200).json(data);
    }
    async updateUserProfile(req, res, next) {
        const { id } = req.user;
        const { nickname, image, password, newPassword } = req.validatedUserUpdate;
        const updateData = { nickname, image }; // password는 Service에서 처리
        const passwordChange = password && newPassword
            ? { oldPassword: password, newPassword }
            : undefined;
        const updatedUser = await this.service.updateUserProfile(id, updateData, passwordChange);
        if (passwordChange) {
            const newAccessToken = await this.service.createToken(updatedUser);
            const newRefreshToken = await this.service.createToken(updatedUser, 'refresh');
            await this.service.updateUserRefreshToken(id, newRefreshToken);
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: constants_1.NODE_ENV === 'production',
                sameSite: 'lax',
            });
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: constants_1.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
        const formattedData = await this.service.filterSensitiveUserData(updatedUser);
        res.status(200).json(formattedData);
    }
    async getUserProducts(req, res, next) {
        const { id } = req.user;
        const products = await this.productService.getUserProducts(id);
        res.status(200).json(products);
    }
    async getUserArticles(req, res) {
        const { id } = req.user;
        const articles = await this.articleService.getUserArticles(id);
        res.status(200).json(articles);
    }
    async likeProductButton(req, res) {
        const userId = req.user.id;
        const { productId } = req.validatedProductId;
        if (!productId)
            throw new error_1.BadRequestError();
        const message = await this.likeService.toggleProductLike(userId, productId);
        return res.status(200).json({ message });
    }
    async likeArticleButton(req, res) {
        const userId = req.user.id;
        const { articleId } = req.validatedArticleId;
        if (!articleId)
            throw new error_1.BadRequestError();
        const message = await this.likeService.toggleArticleLike(userId, articleId);
        return res.status(200).json({ message });
    }
    async likeProductList(req, res) {
        const userId = req.user.id;
        const products = await this.likeService.getLikedProducts(userId);
        return res.status(200).json(products);
    }
    async likeArticleList(req, res) {
        const userId = req.user.id;
        const articles = await this.likeService.getLikedArticles(userId);
        return res.status(200).json(articles);
    }
}
exports.UserController = UserController;
const userRepository = new user_repository_1.UserRepository();
const productRepository = new product_repository_1.ProductRepository();
const articleRepository = new article_repository_1.ArticleRepogitory();
const likeRepository = new like_repository_1.LikeRepository();
const notificationRepo = new notification_repository_1.NotificationRepository();
const notificationService = new notification_service_1.NotificationService(notificationRepo);
const userService = new user_service_1.UserService(userRepository);
const productService = new product_service_1.ProductService(productRepository, notificationService);
const articleService = new article_service_1.ArticleService(articleRepository);
const likeService = new like_service_1.LikeService(likeRepository);
exports.userController = new UserController(userService, productService, articleService, likeService);
//# sourceMappingURL=user.controller.js.map