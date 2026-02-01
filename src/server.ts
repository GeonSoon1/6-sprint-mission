import http from 'http';
import app from './app'; 
import { setupSocket } from './socket';
import { PORT } from './libs/constants';

const server = http.createServer(app);

setupSocket(server)

server.listen(PORT, () => {
  console.log('Server running');
});
