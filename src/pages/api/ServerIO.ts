import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";


export function getIO(res: NextApiResponseServerIO){
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    return io;
}

export function getRooms(io: ServerIO){
    const rooms = io.of('/').adapter.rooms;
    const sids = io.of('/').adapter.sids;
    let publicRooms:string[] = [];
    rooms.forEach((_:any, key:string)=>{
     if(sids.get(key) === undefined)
       publicRooms.push(key);
    });

    return publicRooms;
}

export function changeRoom(socket: Socket, currentRoom:string, newRoom:string)  {
    socket.leave(currentRoom);
    socket.join(newRoom);
    socket.emit('roomChanged',newRoom);
  }