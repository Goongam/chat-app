import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { RemoteSocket, Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer, Server } from "http";
import { DefaultEventsMap, EventsMap } from "socket.io/dist/typed-events";
import { SocketWithNick } from "./socketio";
import { getRoomName } from "@/lib/dbUtil";


interface fetchSocket extends RemoteSocket<EventsMap, any>{
  nickName?: string,
}


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

export async function changeRoom(socket: Socket, currentRoom:string, newRoom:string)  {
  
    socket.leave(currentRoom);
    socket.join(newRoom);

    const roomName = await getRoomName(newRoom);
    socket.emit('roomChanged',roomName);

    // socket.emit('roomChanged',newRoom);
}

export async function registerUser(io: ServerIO, userName:string, newRoom:string){
  let nick = userName;

    let suffixNum = -1;
    let exist = false;
    let sockets = await io.of('/').in(newRoom).fetchSockets() as fetchSocket[];
    
    let nickArray = sockets.map((socket)=> socket.nickName );
    // console.log(sockets);
    do {
      exist = false;
      nick = userName + (++suffixNum === 0 ? '' : suffixNum);
      if(nickArray.includes(nick)) exist = true;
    } while (exist);
    
    // do {
    //   exist = false;
    //   nick = userName + (++suffixNum === 0 ? '' : suffixNum);
    //   io.of('/').adapter.rooms.get(newRoom)?.forEach(socketid => {
    //     // console.log(socket_users.get(socketid), ' | ', nick);
    //     if(socket_users.get(socketid) === nick) exist = true;
    //   });
    // } while (exist);


  return nick;
}

export function getNickFromNamespace(io:ServerIO, id:string, namespace:string){
  // const socket = io.sockets.sockets;
  // return socket.nickName;
}
export function getNickFromAll(io:ServerIO, id:string){
  const socket = io.sockets.sockets.get(id) as SocketWithNick;
  return socket.nickName;
}