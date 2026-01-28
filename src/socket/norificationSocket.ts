import { Socket } from 'socket.io';

const userSocketMap = new Map<number, Socket>();

export function registerSocket(socket: Socket) {
  const user = socket.data.user;
  if (!user) return;

  userSocketMap.set(user.id, socket);

  socket.on('disconnect', () => {
    userSocketMap.delete(user.id);
  });
}
export function sendToUser(userId: number, payload: unknown) {
  const socket = userSocketMap.get(userId);
  if (socket) {
    socket.emit('notification', payload);
  }
}

export function getUserSocket(userId: number): Socket | undefined {
  return userSocketMap.get(userId);
}
