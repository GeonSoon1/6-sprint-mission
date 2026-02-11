"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
exports.notifyUser = notifyUser;
const socket_io_1 = require("socket.io");
const error_1 = require("./libs/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./libs/constants");
let io;
function setupSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*'
        }
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.accessToken;
        if (!token) {
            next(new error_1.AuthorizeError());
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, constants_1.JWT_SECRET);
            socket.data.userId = decoded.userId;
            next();
        }
        catch (error) {
            next(new error_1.AuthorizeError());
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        console.log(`User connected: ${userId} (${socket.id})`);
        socket.join(`user-${userId}`);
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
        });
    });
}
function notifyUser(userId, event, payload) {
    if (!io)
        return;
    io.to(`user-${userId}`).emit(event, payload);
}
//# sourceMappingURL=socket.js.map