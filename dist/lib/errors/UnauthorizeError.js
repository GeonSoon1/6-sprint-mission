"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizeError extends Error {
    constructor() {
        super('Unauthorize');
        this.name = 'UnauthorizeError';
    }
}
exports.default = UnauthorizeError;
