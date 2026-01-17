import { Server } from "socket.io";
import http from "http";
import { AuthorizeError } from "./libs/error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./libs/constants";

let io: Server

export function setupSocket(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: '*'
        }
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth.accessToken;

        if(!token) {
            next(new AuthorizeError())
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };
            socket.data.userId = decoded.userId;
            next();
        } catch (error) {
            next(new AuthorizeError())
        }
    })

    io.on('connection', (socket) => {
            const userId = socket.data.userId;
            console.log(`User connected: ${userId} (${socket.id})`)

            socket.join(`user-${userId}`);

            socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`)
        })
    })
}

export function notifyUser(userId: string, event: string, payload: any) {
    if (!io) return
    io.to(`user-${userId}`).emit(event, payload);
}