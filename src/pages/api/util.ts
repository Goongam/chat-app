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

export async function changeRoom(socket: Socket|RemoteSocket<DefaultEventsMap,any>, currentRoom:string, newRoom:string)  {
  
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

    do {
      exist = false;
      nick = userName + (++suffixNum === 0 ? '' : suffixNum);
      if(nickArray.includes(nick)) exist = true;
    } while (exist);
  
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

export async function getUsersInRoom(io:ServerIO, room: string){
  let sockets = await io.of('/').in(room).fetchSockets() as fetchSocket[];
  let users = sockets.map((socket) => socket.nickName);
  return users;
}

export function getNoMatchingSocket(io:ServerIO){
  const rooms = io.of('/random').adapter.rooms;
  let NoMatchSockets:string[] = [];
  rooms.forEach((joinedSocket, roomName)=>{
    if(!roomName.startsWith('match')) NoMatchSockets.push(roomName);
  })

  return NoMatchSockets;
}