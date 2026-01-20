import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';
const TARGET_USER_ID = '알림을_받을_유저_ID_입력';

const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log(`소켓연결성공 ID: ${socket.id}`);
  console.log(`유저방 입장시도: ${TARGET_USER_ID}`);
  socket.emit('join', TARGET_USER_ID);
});

socket.on('notification', (data) => {
  console.log('알림수신: ', data);
});

socket.on('disconnect', () => {
  console.log('연결 종료');
});
