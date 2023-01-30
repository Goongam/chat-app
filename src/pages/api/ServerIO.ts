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

export function registerUser(io: ServerIO, socket_users:Map<string, string>, userName:string, newRoom:string){
  let nick = userName;
  console.log(nick);
  console.log(socket_users);
  // io.of('/').adapter.rooms.get(newRoom)?.forEach(socketid => {
  //   let suffixNum = 1;
  //   while(socket_users.get(socketid) === nick){
  //     console.log(socket_users.get(socketid),' | ',nick);
  //     nick = userName + ++suffixNum;
  //   }
  // });
    let suffixNum = -1;
    let exist = false;

    do {
      exist = false;
      nick = userName + (++suffixNum === 0 ? '' : suffixNum);
      io.of('/').adapter.rooms.get(newRoom)?.forEach(socketid => {
        // console.log(socket_users.get(socketid), ' | ', nick);
        if(socket_users.get(socketid) === nick) exist = true;
      });
    } while (exist);


  return nick;
}