"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const product_service_1 = require("../products/product.service");
const product_repository_1 = require("../products/product.repository");
const notification_repository_1 = require("../notifications/notification.repository");
const notification_service_1 = require("../notifications/notification.service");
class ProductController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(req, res) {
        const dto = {
            ...req.validatedProductCreate,
            userId: req.user.id,
        };
        const data = await this.service.create(dto);
        res.status(201).json(data);
    }
    async getProducts(req, res) {
        const dto = {
            page: req.validatedProductQuery.page || 1,
            limit: req.validatedProductQuery.limit || 10,
            search: req.validatedProductQuery.search || '',
            sort: req.validatedProductQuery.sort || 'recent',
            userId: req.auth?.userId ?? null,
        };
        const data = await this.service.getProducts(dto);
        res.status(200).json(data);
    }
    async getById(req, res) {
        const id = req.validatedId.id;
        const userId = req.auth?.userId ?? null;
        const data = await this.service.getById(id, userId);
        res.status(200).json(data);
    }
    async update(req, res) {
        const id = req.validatedId.id;
        const dto = {
            ...Object.fromEntries(Object.entries(req.validatedProductUpdate).filter(([_, v]) => v !== undefined)),
            userId: req.user.id,
        };
        const updated = await this.service.update(id, dto);
        res.status(200).json(updated);
    }
    async delete(req, res) {
        const id = req.validatedId.id;
        await this.service.delete(id);
        res.status(204).json();
    }
}
exports.ProductController = ProductController;
// router에서 사용할 수 있도록 조립
const productRepository = new product_repository_1.ProductRepository();
const notificationRepo = new notification_repository_1.NotificationRepository();
const notificationService = new notification_service_1.NotificationService(notificationRepo);
const productService = new product_service_1.ProductService(productRepository, notificationService);
exports.productController = new ProductController(productService);
//# sourceMappingURL=product.controller.js.map