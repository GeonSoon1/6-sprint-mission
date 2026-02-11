
import { ExpressRequest, ExpressResponse } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';
export function UploadSingleImage(req: ExpressRequest, res: ExpressResponse) {
    if (!req.file)
        throw new CustomError(404, "file not found");

    // multer-s3를 사용하면 req.file 객체에 location 속성(S3 URL)이 추가됩니다.
    const { location } = req.file as any;
    res.status(201).json({ url: location });
}