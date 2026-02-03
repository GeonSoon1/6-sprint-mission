import { PORT, EXPRESS } from './libs/constants';
import cors from 'cors';
import { RouterManager } from './Routers/routerManager';
import { getCorsOrigin } from './libs/corsSetUp';
import errorHandler from './libs/Handler/errorHandler';
import { expressjwt } from 'express-jwt';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const app = EXPRESS();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: getCorsOrigin(), // Express에서 쓰던 것과 똑같이 맞춰주세요
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.accessToken;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; };
        socket.data.userId = payload.userId;
        next();
    } catch (e) {
        next(new Error('Authentication error'));
    }
});


app.set('io', io);

app.use(cors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(EXPRESS.static('public'));
app.use(EXPRESS.json());
app.use(EXPRESS.urlencoded({ extended: true }));

app.use('/upload', EXPRESS.static('upload'));



app.use('/', RouterManager);



app.use(errorHandler);

// --- 소켓 연결 이벤트 (테스트용) ---
io.on('connection', (socket) => {
    console.log('새로운 소켓 연결:', socket.id);

    // 로그인하면 해당 유저의 ID로 방을 만들어줌 (알림 기능을 위해 필수)
    const userId = socket.data.userId;
    if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    }
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;