"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../lib/asyncHandler"));
const u = __importStar(require("../controllers/mypage-controller"));
const ul = __importStar(require("../controllers/mypageList-controller"));
const ulk = __importStar(require("../controllers/mypageLikes-controller"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const userRoute = express_1.default.Router();
const common_dbcheck_validation_1 = require("../validators/common-dbcheck-validation");
const common_query_validation_1 = require("../validators/common-query-validation");
const user_validation_1 = require("../validators/user-validation");
const userLike_validation_1 = require("../validators/userLike-validation");
// ======= ======= ======= ======= =======
// =======  User 정보 확인/수정 기능  =======
// ======= ======= ======= ======= =======
userRoute.get('/', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, (0, asyncHandler_1.default)(u.userInfo));
userRoute.patch('/', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, user_validation_1.userUpdateValidation, (0, asyncHandler_1.default)(u.updateUserInfo));
userRoute.patch('/password', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, user_validation_1.userUpdatePasswordValidation, (0, asyncHandler_1.default)(u.updatePassword));
// ======= ======= ======= ======= =======
// === User 작성 product, article list  ===
// ======= ======= ======= ======= =======
userRoute.get('/products', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_query_validation_1.getQueryValidation, (0, asyncHandler_1.default)(ul.getUserCreatedProductsList));
userRoute.get('/articles', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_query_validation_1.getQueryValidation, (0, asyncHandler_1.default)(ul.getUserCreatedArticlesList));
// 댓글 보기는 시간 남으면 작업 하겠습니다..
// ======= ======= ======= ======= =======
// === User product, article like list ===
// ======= ======= ======= ======= =======
userRoute.get('/products/like', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, userLike_validation_1.productLikeListValidation, (0, asyncHandler_1.default)(ulk.getUserlikedProductsList));
userRoute.get('/articles/like', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, userLike_validation_1.articleLikeListValidation, (0, asyncHandler_1.default)(ulk.getUserlikedArticlesList));
exports.default = userRoute;
