"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middleware/asyncHandler");
const authController_1 = require("../controllers/authController");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/register', validation_1.validateRegister, (0, asyncHandler_1.asyncHandler)(authController_1.register));
router.post('/login', validation_1.validateLogin, (0, asyncHandler_1.asyncHandler)(authController_1.login));
router.post('/refresh', (0, asyncHandler_1.asyncHandler)(authController_1.refresh));
router.post('/logout', authController_1.logout);
router.get('/me', authenticate_1.default, (0, asyncHandler_1.asyncHandler)(authController_1.getMe));
router.patch('/profile', authenticate_1.default, validation_1.validatePatchProfile, (0, asyncHandler_1.asyncHandler)(authController_1.updateProfile));
router.patch('/password', authenticate_1.default, validation_1.validateChangePassword, (0, asyncHandler_1.asyncHandler)(authController_1.changePassword));
exports.default = router;
