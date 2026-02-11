"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadSingleImage = UploadSingleImage;
const errorHandler_1 = require("../libs/Handler/errorHandler");
function UploadSingleImage(req, res) {
    if (!req.file)
        return new errorHandler_1.CustomError(404, "file not found");
    const { filename } = req.file;
    const path = `files/${filename}`;
    res.json({ path });
}
//# sourceMappingURL=uploadController.js.map