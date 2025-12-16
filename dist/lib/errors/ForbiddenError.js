"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenError extends Error {
    constructor(modelName) {
        super(`You are not allowed to control this ${modelName}.`);
        this.name = 'ForbiddenError';
    }
}
exports.default = ForbiddenError;
