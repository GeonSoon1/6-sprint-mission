"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const superstruct_1 = require("superstruct");
const errorHandler_1 = require("../libs/Handler/errorHandler");
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const productLikeRepository_1 = __importDefault(require("../repositories/productLikeRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userStructs_1 = require("../structs/userStructs");
function hashingPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        // 함수 추가
        return bcrypt_1.default.hash(password, 12);
    });
}
class UserService {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existedUser = yield userRepository_1.default.findByEmail(user.email);
            if (existedUser) {
                throw new errorHandler_1.CustomError(422, 'User already exists', {
                    email: user.email,
                });
            }
            const hashedPassword = yield hashingPassword(user.password);
            const createdUser = yield userRepository_1.default.save(Object.assign(Object.assign({}, user), { password: hashedPassword }));
            return this.filterSensitivceUserData(createdUser);
        });
    }
    filterSensitivceUserData(user) {
        const { password, refreshToken } = user, rest = __rest(user, ["password", "refreshToken"]);
        return rest;
    }
    getUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.default.findByEmail(email);
            if (!user)
                throw new errorHandler_1.CustomError(401, 'Unauthorized');
            yield this.verifyPassword(password, user.password);
            return this.filterSensitivceUserData(user);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.default.findById(id);
            if (!user) {
                throw new errorHandler_1.CustomError(404, 'User not found');
            }
            return this.filterSensitivceUserData(user);
        });
    }
    updateProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(data, userStructs_1.PatchUser);
            const user = yield userRepository_1.default.update(id, data);
            if (!user) {
                throw new errorHandler_1.CustomError(404, 'User not found');
            }
            return this.filterSensitivceUserData(user);
        });
    }
    updatePassword(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(data, userStructs_1.ChangePassword);
            const { currentPassword, newPassword, confirmNewPassword } = data;
            if (newPassword !== confirmNewPassword) {
                throw new errorHandler_1.CustomError(400, "Passwords don't match");
            }
            const user = yield userRepository_1.default.findById(id);
            if (!user) {
                throw new errorHandler_1.CustomError(404, 'User not found');
            }
            yield this.verifyPassword(currentPassword, user.password);
            const hashedPassword = yield hashingPassword(newPassword);
            const updatedUser = yield userRepository_1.default.update(id, { password: hashedPassword });
            return this.filterSensitivceUserData(updatedUser);
        });
    }
    getProductsByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield productRepository_1.default.findByUserId(id);
            return products;
        });
    }
    getLikedProductsByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield productLikeRepository_1.default.findLikedProductsByUserId(id);
            return products;
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userRepository_1.default.update(id, data);
        });
    }
    verifyPassword(inputPassword, savedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValid = yield bcrypt_1.default.compare(inputPassword, savedPassword);
            if (!isValid)
                throw new errorHandler_1.CustomError(401, 'Unauthorized');
        });
    }
    createToken(user, type) {
        const JWTsecretKey = process.env.JWT_SECRET;
        if (!JWTsecretKey)
            throw new errorHandler_1.CustomError(500, 'JWT_SECRET is not defined');
        const payload = { userId: user.id };
        const options = {
            expiresIn: type === 'refresh' ? '1d' : '10m',
        };
        return jsonwebtoken_1.default.sign(payload, JWTsecretKey, options);
    }
    refreshToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.default.findById(userId);
            if (!user || user.refreshToken !== refreshToken) {
                throw new errorHandler_1.CustomError(401, 'Unauthorized');
            }
            const accessToken = this.createToken(user); // 변경
            const newRefreshToken = this.createToken(user, 'refresh'); // 추가
            return { accessToken, newRefreshToken }; // 변경
        });
    }
}
exports.userService = new UserService();
//# sourceMappingURL=userService.js.map