// const httpServer: NetServer = res.socket.server as any;
// const io = new ServerIO(httpServer, {
//   path: "/api/socketio",
// });

import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";



export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
   
};
