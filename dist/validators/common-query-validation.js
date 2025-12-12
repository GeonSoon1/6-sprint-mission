"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryValidation = getQueryValidation;
const common_types_1 = require("../types/express/common.types");
function getQueryValidation(req, res, next) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        // offset & limit : 숫자 변환 + 검증
        const offset = Number((_a = req.query.offset) !== null && _a !== void 0 ? _a : 0);
        const offsetFloat = offset % 1;
        if (isNaN(offset) || offset < 0 || offsetFloat)
            return res
                .status(401)
                .json({ message: 'offset : 올바른 숫자를 입력 해 주세요' });
        const limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10);
        const limitFloat = limit % 1;
        if (isNaN(limit) || limit <= 0 || limit > 100 || limitFloat)
            return res
                .status(401)
                .json({ message: 'limit : 1에서 100 사이 숫자를 입력 해 주세요' });
        // orderBy : 출력 순서 검증
        const order = String((_c = req.query.order) !== null && _c !== void 0 ? _c : common_types_1.OrderType.NEWEST);
        const orderTypeChange = order;
        const orderBy = common_types_1.OrderByMap[orderTypeChange];
        // enum 검증
        if (!Object.values(common_types_1.OrderType).includes(order)) {
            return res.status(401).json({
                message: 'order : newest 또는 oldest 중 한가지를 작성 해 주세요',
            });
        }
        // product - name & description : 문자 검증
        const name = String((_d = req.query.name) !== null && _d !== void 0 ? _d : '');
        const description = String((_e = req.query.description) !== null && _e !== void 0 ? _e : '');
        // article - title & content : 문자 검증
        const title = String((_f = req.query.title) !== null && _f !== void 0 ? _f : '');
        const content = String((_g = req.query.content) !== null && _g !== void 0 ? _g : '');
        req.validated = {
            offset,
            limit,
            name,
            description,
            title,
            content,
            orderBy,
        };
        next();
    }
    catch (err) {
        next(err);
    }
}
