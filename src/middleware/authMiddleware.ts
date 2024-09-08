import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const verifySocketToken = (socket: Socket, next: (err?: any) => void) => {
    const token = socket.handshake.auth.token; // فرض بر این است که توکن از `socket.handshake.auth.token` می‌آید

    if (!token) {
        return next(new Error('Access Denied'));
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        (socket.data as any).userId = (decoded as { userId: string }).userId; // تنظیم userId در data
        next();
    } catch (err) {
        next(new Error('Invalid Token'));
    }
};