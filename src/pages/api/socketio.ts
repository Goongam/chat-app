import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";

import { changeRoom, getIO, getNickFromAll, getRooms, registerUser } from "./ServerIO";

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface SocketWithNick extends Socket{
  nickName?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (res.socket.server.io) {
        res.end();
        return;
    }


    console.log("New Socket.io server...✅");


    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    res.socket.server.io = io;
    

    io.on('connection', (socket: SocketWithNick) =>{
        
        socket.on("chat", (message, nick, room) => {

            io.to(room).emit("chat",socket.nickName, message);
            // socket.emit("pchat","개인채팅");
        });

        socket.on('join',async (userName, currentRoom, newRoom)=>{
          // socket_users.set(socket.id, nick);

          // io.of('/').adapter.rooms.get(newRoom)?.forEach(socketid => {
          //   let suffixNum = 2;
          //   while(socket_users.get(socketid) === nick){
          //     nick = userName + suffixNum++;
          //   }
          //   socket_users.set(socket.id, nick);
          // });
          let nick = await registerUser(io, userName, newRoom);
          socket.nickName = nick;
          // socket_users.set(socket.id, nick);
          changeRoom(socket, currentRoom, newRoom);
        });

        socket.on('create', (userName, roomName) => {

          if(!(io.of('/').adapter.rooms.get(roomName)?.size)){
            socket.nickName = userName;
            changeRoom(socket, '', roomName);
          }else{ //비정상 접근
            console.log('비정상 접근');
          }
        });

        socket.on('rooms', ()=>{
           socket.emit('rooms',getRooms(io));
        })
    });

// create-room (argument: room)
// delete-room (argument: room)
// join-room (argument: room, id)
// leave-room (argument: room, id)
    io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });
    
    io.of("/").adapter.on("join-room", (room, id) => {
      if(room !== id) io.to(room).emit("chat",getNickFromAll(io, id), '님이 입장하였습니다');
    });

    io.of("/").adapter.on("leave-room", (room, id) => {
      io.to(room).emit("chat",getNickFromAll(io, id), '님이 퇴장하였습니다');

    });

    res.end();
};
