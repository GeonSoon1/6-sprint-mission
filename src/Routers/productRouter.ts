import { EXPRESS } from '../libs/constants';
import { catchAsync } from '../libs/catchAsync';
import auth from '../middlewares/auth';
import ProductController from '../controller/productController';

const productRouter = EXPRESS.Router();
const productController = new ProductController();

productRouter.route('/')
    .get(auth.softVerifyAccessToken, catchAsync(productController.GetProduct))
    .post(auth.verifyAccessToken, catchAsync(productController.PostProduct));

productRouter.route('/:id')
    .get(auth.softVerifyAccessToken, catchAsync(productController.GetProductById))
    .patch(auth.verifyAccessToken, catchAsync(productController.PatchProductById))
    .delete(auth.verifyAccessToken, catchAsync(productController.DeleteProductById));

productRouter.post('/:id/like', auth.verifyAccessToken, catchAsync(productController.likeProduct));

export default productRouter;