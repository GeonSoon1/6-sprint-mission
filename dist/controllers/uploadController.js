"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileController = void 0;
const uploadFileController = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '업로드할 파일이 없습니다.' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        return res.status(200).json({
            message: '파일 업로드 성공!',
            fileName: req.file.originalname,
            fileUrl,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFileController = uploadFileController;
