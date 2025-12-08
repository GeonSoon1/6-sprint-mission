"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errorhandler_1 = __importDefault(require("./middleware/errorhandler"));
const constants_1 = require("./lib/constants");
const imgRoute_1 = __importDefault(require("./routers/imgRoute"));
const authRoute_1 = __importDefault(require("./routers/authRoute"));
const productRoute_1 = __importDefault(require("./routers/productRoute"));
const articleRoute_1 = __importDefault(require("./routers/articleRoute"));
const userRoute_1 = __importDefault(require("./routers/userRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 쿠키 작업
app.use((0, cookie_parser_1.default)());
// 이미지 Multer 먼저 실행
app.use('/files', imgRoute_1.default);
app.use('/files', express_1.default.static('files'));
// 각각 route 작업
app.use('/auth', authRoute_1.default);
app.use('/articles', articleRoute_1.default);
app.use('/products', productRoute_1.default);
app.use('/mypage', userRoute_1.default);
app.use(errorhandler_1.default);
app.listen(constants_1.PORT, () => {
    console.log('localhost 3000🚀');
});
