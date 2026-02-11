"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncAll = exports.catchAsync = void 0;
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
const catchAsyncAll = (...fns) => {
    return fns.map(exports.catchAsync);
};
exports.catchAsyncAll = catchAsyncAll;
//# sourceMappingURL=catchAsync.js.map