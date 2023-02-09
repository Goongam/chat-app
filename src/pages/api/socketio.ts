import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";

import { changeRoom, getNickFromAll, getRooms, getUsersInRoom, registerUser } from "./util";


import { createRoomDB, dbInit, insertMsgDB } from "@/lib/dbUtil";

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface SocketWithNick extends Socket{
  nickName?: string,
}
export interface Rooms{
  [key:number]: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (res.socket.server.io) {
        res.end();
        return;
    }

    // connectDB();
    dbInit();

    console.log("New Socket.io server...✅");


    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    res.socket.server.io = io;
    

    io.on('connection', (socket: SocketWithNick) =>{
        
        socket.on("chat", async (message, room) => {

            insertMsgDB(socket.nickName, room, message);

            io.to(room).emit("chat",socket.nickName, message);
            // socket.emit("pchat","개인채팅");
        });

        socket.on('join',async (userName, currentRoom, roomid)=>{

          let nick = await registerUser(io, userName, roomid);
          socket.nickName = nick;
          
          changeRoom(socket, currentRoom, roomid);
        });

        socket.on('create', async (userName, roomName) => {

          if(!(io.of('/').adapter.rooms.get(roomName)?.size)){

            socket.nickName = userName;

            const roomIndex = await createRoomDB(roomName);

            socket.emit('roomIndex',roomIndex);
            changeRoom(socket, '', `${roomIndex}`);

          }else{ //비정상 접근
            console.log('비정상 접근');
          }
        });

        socket.on('rooms', ()=>{
           socket.emit('rooms',getRooms(io));
        });

    });

// create-room (argument: room)
// delete-room (argument: room)
// join-room (argument: room, id)
// leave-room (argument: room, id)
    io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });
    
    io.of("/").adapter.on("join-room", async (room, id) => {
      if(room !== id) io.to(room).emit("notice",`${getNickFromAll(io, id)}님이 입장하였습니다`);
      
      io.to(room).emit("members",await getUsersInRoom(io, room));

    });

    io.of("/").adapter.on("leave-room", async (room, id) => {

      io.to(room).emit("notice",`${getNickFromAll(io, id)}님이 퇴장하였습니다`);
      io.to(room).emit("members",await getUsersInRoom(io, room));
    });

    res.end();
};
