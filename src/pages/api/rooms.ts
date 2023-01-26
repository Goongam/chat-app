import { NextApiRequest } from "next";
import { getRooms } from "./ServerIO";
import { NextApiResponseServerIO } from "./types/chat";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO){
  
    // const message = req.body;
    const rooms = getRooms(res.socket.server.io);

    console.log('rooms:',rooms);

    res.status(201).json({
        rooms: rooms,
    });
  
};