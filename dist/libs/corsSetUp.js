"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOrigin = void 0;
require("dotenv/config");
const getCorsOrigin = () => {
    const corsOrigin = process.env.CORS_ORIGIN;
    if (!corsOrigin || corsOrigin === '*')
        return '*';
    if (corsOrigin.includes(','))
        return corsOrigin.split(',').map((origin) => origin.trim().replace(/\/$/, ''));
    // 단일 origin (trailing slash 제거)
    return corsOrigin.trim().replace(/\/$/, '');
};
exports.getCorsOrigin = getCorsOrigin;
//# sourceMappingURL=corsSetUp.js.map