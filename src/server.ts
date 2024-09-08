import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authenticateSocket from './middleware/authMiddleware';
import Message from '../models/Message';
import authRoutes from './routes/auth';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/chat-system')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('create channel', (channelName) => {
        socket.join(channelName);
        socket.emit('channel created', channelName);
    });

    socket.on('join channel', (channelName) => {
        socket.join(channelName);
        socket.emit('channel joined', channelName);
    });

    socket.on('chat message', (data) => {
        const { channel, message } = data;
        io.to(channel).emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/messages', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
});