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
    // const io = getIO(res);

    res.socket.server.io = io;
    


    io.on('connection', (socket) =>{
        
        socket.on("chat", (message, room) => {
            io.to(room).emit("chat", message);
            // socket.emit("pchat","개인채팅");

        });

        socket.on('join',(currentRoom, newRoom)=>{
          // if(getRooms(io).includes(newRoom)){
          //   changeRoom(socket, currentRoom, newRoom);
          // }else{
          //   //TODO: 방이 존재하지 않음
          //   console.log('방이 존재 하지 않음')
          // }
          
          changeRoom(socket, currentRoom, newRoom);
        });

        // socket.on('createRoom',(currentRoom, newRoom)=>{
        //   if(getRooms(io).includes(newRoom)){
        //     //TODO: 이미 방이 존재함
        //     console.log('이미 방이 존재함');
        //   }else{
        //     changeRoom(socket, currentRoom, newRoom);
        //   }
        // });

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
    });
    io.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`socket ${id} has leaved room ${room}`);
    });
    res.end();

};
