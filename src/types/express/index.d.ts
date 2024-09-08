import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string; // اضافه کردن userId به نوع Request
        }
    }
}