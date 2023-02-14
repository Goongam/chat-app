import { useCallback } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;
export function useSocket(namespace?: string|undefined){

    const disconnect = useCallback(()=>{
        socket?.close();
        socket = undefined;
    },[]);

    if(!socket) {
        namespace = namespace ?? '/';
        socket = socket = io(namespace,{
            path: "/api/socketio",
        });
        socket.connect();
    }

    // if(!namespace) return {socket, disconnect};
    
    return {socket, disconnect};
}