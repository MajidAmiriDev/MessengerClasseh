import { DefaultEventsMap } from 'socket.io/dist/typed-events';

declare module 'socket.io' {
    interface Socket<DefaultEventsMap = DefaultEventsMap, A = any, B = any, C = any> {
        userId?: string;
    }
}