import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (res.socket.server.io) {
        console.log('Already set up');
        res.end();
        return;
    }


    console.log("New Socket.io server...✅");

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    res.socket.server.io = io;
    
    io.on('connection', (socket) =>{

        socket.on("chat", (message) => {
            io.emit("chat", message);
            socket.emit("pchat","개인채팅");
        })
    })
    res.end();
};