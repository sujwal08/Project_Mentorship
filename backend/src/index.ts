import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import dotenv from 'dotenv';
import { marketService } from './market/marketService';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
});

server.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Start the market polling service
    marketService.startPolling(io);
});
