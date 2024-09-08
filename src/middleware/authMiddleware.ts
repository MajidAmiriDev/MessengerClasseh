import jwt from 'jsonwebtoken';

const authenticateSocket = (socket: any, next: any) => {
    const token = socket.handshake.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, 'your_jwt_secret', (err: any, decoded: any) => {
            if (err) return next(new Error('Authentication error'));
            socket.userId = decoded.id;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
};

export default authenticateSocket;