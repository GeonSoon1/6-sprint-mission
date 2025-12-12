"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderByMap = exports.OrderType = void 0;
var OrderType;
(function (OrderType) {
    OrderType["OLDEST"] = "oldest";
    OrderType["NEWEST"] = "newest";
})(OrderType || (exports.OrderType = OrderType = {}));
exports.OrderByMap = {
    [OrderType.OLDEST]: { createdAt: 'asc' },
    [OrderType.NEWEST]: { createdAt: 'desc' },
};
