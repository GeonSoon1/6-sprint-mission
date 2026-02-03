"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImage = uploadSingleImage;
const error_1 = require("../../libs/error");
function uploadSingleImage(req, res, next) {
    const file = req.file;
    if (!file) {
        return next(new error_1.BadRequestError());
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/${file.path}`;
    res.status(200).json({
        imageUrl: imageUrl,
    });
}
//# sourceMappingURL=image.controller.js.map