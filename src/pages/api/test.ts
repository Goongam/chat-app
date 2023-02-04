import { NextApiRequest } from "next";
import { getRooms } from "./util";
import { NextApiResponseServerIO } from "./types/chat";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO){

    const rooms = res.socket.server.io.of('/').adapter.rooms;
    console.log('rooms:',rooms);
    
    res.send(rooms);
};
