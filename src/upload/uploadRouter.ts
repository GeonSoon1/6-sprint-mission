import { EXPRESS } from '../libs/constants';
import { catchAsync } from '../libs/catchAsync';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import {
    UploadSingleImage
} from './uploadController';

const uploadRouter = EXPRESS.Router();

const requiredEnvVars = [
    'AWS_S3_REGION',
    'AWS_S3_ACCESS_KEY',
    'AWS_S3_SECRET_KEY',
    'AWS_S3_BUCKET_NAME'
];
const missingVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingVars.length > 0) {
    throw new Error(`AWS 환경 변수가 설정되지 않았습니다: ${missingVars.join(', ')}. .env 파일을 확인해주세요.`);
}

const s3 = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME as string,
        key: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    })
});

uploadRouter.post('/', upload.single('attachment'),
    catchAsync(UploadSingleImage));

export default uploadRouter;
