
import { ExpressRequest, ExpressResponse } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';
export function UploadSingleImage(req: ExpressRequest, res: ExpressResponse) {
    if (!req.file)
        throw new CustomError(404, "file not found");
    const { filename } = req.file;
    const path = `files/${filename}`;
    res.json({ path });
}