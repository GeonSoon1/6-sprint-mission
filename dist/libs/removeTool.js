"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = void 0;
// undefined인 키를 싹 지워주는 함수
const removeUndefined = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};
exports.removeUndefined = removeUndefined;
//# sourceMappingURL=removeTool.js.map