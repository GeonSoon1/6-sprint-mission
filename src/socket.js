import { Server } from "socket.io";
import cookie from "cookie";
import { ACCESS_TOKEN_COOKIE_NAME } from "./lib/constants";
import { verifyAccessToken } from "./lib/token";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next(new Error("NO_COOKIE"));

      const cookies = cookie.parse(cookieHeader);
      const token = cookies[ACCESS_TOKEN_COOKIE_NAME];
      if (!token) return next(new Error("NO_TOKEN"));

      const { userId } = verifyAccessToken(token);
      socket.userId = userId;

      next();
    } catch (e) {
      next(new Error("INVALID_TOKEN"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
