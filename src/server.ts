import http from 'http';
import app from '@/app';
import { setupWebSocket } from '@lib/websocket';
import { PORT } from '@lib/constants';

const server = http.createServer(app);
setupWebSocket(server); // 웹소켓 연결

server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT} 🚀`);
});
