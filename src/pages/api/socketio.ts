import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

import { changeRoom, getIO, getRooms } from "./ServerIO";

export const config = {
  api: {
    bodyParser: false,
  },
};


let socket_users: Map<string, string>;
export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (res.socket.server.io) {
        res.end();
        return;
    }


    console.log("New Socket.io server...✅");
    socket_users = new Map();

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    res.socket.server.io = io;
    


    io.on('connection', (socket) =>{
        
        socket.on("chat", (message, nick, room) => {
            io.to(room).emit("chat",nick, message);
            // socket.emit("pchat","개인채팅");

        });

        socket.on('join',(userName, currentRoom, newRoom)=>{

          
          socket_users.set(socket.id, userName);
          console.log(socket_users);
          changeRoom(socket, currentRoom, newRoom);
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
      console.log(`socket ${id} has joined room ${room}`);
      
      if(room !== id)
        io.to(room).emit("chat",socket_users.get(id), '님이 입장하였습니다');

    });

    io.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`socket ${socket_users.get(id)} has leaved room ${room}`);
      io.to(room).emit("chat",socket_users.get(id), '님이 퇴장하였습니다');
      if(id !== room) socket_users.delete(id);

    });

    res.end();
};
