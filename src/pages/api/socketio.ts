import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";

import { changeRoom, getNickFromAll, getNoMatchingSocket, getRooms, getUsersInRoom, registerUser } from "./util";


import { createRoomDB, dbInit, insertMsgDB } from "@/lib/dbUtil";

import { namespaces } from "@/constants";

import { OpenAI } from "@/lib/openAi";

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface SocketWithNick extends Socket{
  nickName?: string,
}

export interface SocketWithAI extends Socket{
  openAI?: OpenAI,
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

          if(userName !== nick) socket.emit('userName',nick);
          
          changeRoom(socket, currentRoom, roomid);
        });

        socket.on('create', async ({userName, roomName, password}) => {
          console.log('pass:',password);
          
          if(!(io.of('/').adapter.rooms.get(roomName)?.size)){

            socket.nickName = userName;

            const roomIndex = await createRoomDB(roomName, password);

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


  //랜덤채팅
    io.of(namespaces.random).on('connection', async (socket: SocketWithNick)=>{
      // const noMathchSockets = io.of('/random').adapter.rooms;
      // socket.emit('userName',socket.id);

      socket.on('userName',(userName)=>{
        socket.nickName = userName;
      });

      if(getNoMatchingSocket(io).length >= 2){
        let sockets = await io.of(namespaces.random).fetchSockets();
        const socket1 = sockets.find((socket)=>socket.id === getNoMatchingSocket(io)[0]);
        const socket2 = sockets.find((socket)=>socket.id === getNoMatchingSocket(io)[1]);

        // console.log('socket1',socket1);
        // console.log('socket2',socket2);

        if(socket1 && socket2) {//매칭성공
          const roomIndex = await createRoomDB('random-chat');
          const matchRoomIndex = 'match'+roomIndex;

          socket1.leave(socket1?.id);
          socket2.leave(socket2?.id);
          socket1.join(matchRoomIndex);
          socket2.join(matchRoomIndex);
          
          io.of(namespaces.random).to(matchRoomIndex).emit('roomIndex',matchRoomIndex);
          io.of(namespaces.random).to(matchRoomIndex).emit('random-join', '상대방이 입장하였습니다');
          
        }
          
      }

      socket.on("chat", async (message, room) => {
        if(!room) return;
        
        insertMsgDB(socket.handshake.address, room, message);

        io.of(namespaces.random).to(room).emit("chat",socket.nickName, message);
      });

      

    });


    io.of(namespaces.ai).on('connection', async (socket: SocketWithAI)=>{
      const roomIndex = await createRoomDB('ai-chat');
      socket.join(roomIndex);
      socket.emit('roomIndex',roomIndex);
      
      socket.nickName = 'me';

      socket.openAI = new OpenAI();

      socket.on('chat', async (message)=>{   
         
        if(!socket.openAI){
          socket.emit('notice', socket.nickName, 'AI서버와 연결 실패');
          return;
        }
        socket.emit('chat', socket.nickName, message);

        const receiveMsg = await socket.openAI.chat(message);
        socket.emit('chat', 'AI', receiveMsg);
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

    io.of(namespaces.random).adapter.on('leave-room',async (room, id) => {
      io.of(namespaces.random).to(room).emit('notice-random', '상대방이 퇴장하였습니다');
    })

    // io.of(namespaces.random).adapter.on('join-room',async (room, id) => {
    //   io.of(namespaces.random).emit('notice-random', 'join', id);
    // })
    // io.of()
    res.end();
};
