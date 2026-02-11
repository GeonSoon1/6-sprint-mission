"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./socket");
const constants_1 = require("./libs/constants");
const server = http_1.default.createServer(app_1.default);
(0, socket_1.setupSocket)(server);
server.listen(constants_1.PORT, () => {
    console.log('Server running');
});
//# sourceMappingURL=server.js.map