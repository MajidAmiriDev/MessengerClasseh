import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const setIO = (newIO: SocketIOServer) => {
    io = newIO;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized!");
    }
    return io;
};