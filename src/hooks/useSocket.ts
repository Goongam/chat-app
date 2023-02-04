import { useCallback } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;
export function useSocket(){

    const disconnect = useCallback(()=>{
        socket?.close();
        socket = undefined;
    },[]);

    if(!socket) {
        socket = socket = io({
            path: "/api/socketio",
        });
        socket.connect();
    }

    return {socket, disconnect};
}