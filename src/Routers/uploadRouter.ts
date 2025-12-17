import { EXPRESS } from '../libs/constants';
import { catchAsync } from '../libs/catchAsync';
import multer from 'multer';
import {
    UploadSingleImage
} from '../controller/uploadController';

const uploadRouter = EXPRESS.Router();

const upload = multer({ dest: 'upload/' });

uploadRouter.post('/', upload.single('attachment'),
    catchAsync(UploadSingleImage));

uploadRouter.use('/', EXPRESS.static('upload'));

export default uploadRouter;
