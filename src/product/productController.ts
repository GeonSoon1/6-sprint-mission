import { productService } from './productService';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/structs';
import { ExpressHandler } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';
import { removeUndefined } from '../libs/removeTool';


export default class ProductController {
    GetProduct: ExpressHandler = async (req, res) => {
        const { offset = '0', limit = '0', order = 'newest', name = "", description = "" } = req.query;
        let orderBy;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }
        const parsedOffset = parseInt(offset as string, 10) || 0;
        const parsedLimit = parseInt(limit as string, 10) || 0;

        const findOptions: any = {
            where: {
                name: {
                    contains: name as string,
                },
                description: {
                    contains: description as string,
                },
            },
            orderBy,
            skip: parsedOffset,
        };

        if (parsedLimit > 0) {
            findOptions.take = parsedLimit;
        }

        const userId = req.user ? req.user.userId : null;
        if (!userId) throw new CustomError(404, "UserId Not Found");
        const products = await productService.getProducts(findOptions, userId);
        res.send(products);
    };

    GetProductById: ExpressHandler = async (req, res) => {
        const id = req.params.id;
        if (!id) throw new CustomError(400, "id is required");
        const _id = parseInt(id);
        const userId = req.user ? req.user.userId : null;
        if (!userId) throw new CustomError(404, "userId Not Found");
        const product = await productService.getProductById(_id, userId);
        res.send(product);
    };

    PostProduct: ExpressHandler = async (req, res) => {
        assert(req.body, CreateProduct);
        const { ...userFields } = req.body;
        const userId = req.user ? req.user.userId : null;
        if (!userId) throw new CustomError(404, "userId Not Found");
        const product = await productService.createProducts({ ...userFields, userId });
        res.status(201).send(product);
    };

    PatchProductById: ExpressHandler = async (req, res) => {
        const id = req.params.id;
        if (!id) throw new CustomError(400, "id is required");
        const _id = parseInt(id);

        const userId = req.user ? req.user.userId : null;
        if (!userId) throw new CustomError(401, "Unauthorized");

        assert(req.body, PatchProduct);
        const userFields = removeUndefined(req.body);
        const { product, notifications } = await productService.updateProduct(_id, userFields);
        if (notifications && notifications.length > 0) {
            const io = req.app.get('io');
            if (io) {
                notifications.forEach((noti) => {
                    io.to(noti.userId).emit('notification', noti);
                });
            }
        }

        res.send(product);
    };

    DeleteProductById: ExpressHandler = async (req, res) => {
        const id = req.params.id;
        if (!id) throw new CustomError(400, "id is required");
        const _id = parseInt(id);
        const userId = req.user ? req.user.userId : null;
        if (!userId) throw new CustomError(404, "userId Not Found");
        const Product = await productService.deleteProduct(_id);
        res.send(Product);
    };

    likeProduct: ExpressHandler = async (req, res) => {
        if (!req.user) throw new CustomError(404, "user Not Found");
        const userId = req.user.userId;
        const productId = req.params.id;
        if (!productId) throw new CustomError(400, "productId is required");
        const _productId = parseInt(productId);
        const result = await productService.likeProduct(userId, _productId);
        return res.status(200).json(result);
    };
}