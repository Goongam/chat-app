import { NextApiRequest } from "next";
import { getRooms } from "./util";
import { NextApiResponseServerIO } from "./types/chat";
import { getRoom, getRoomName } from "@/lib/dbUtil";



export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO){

    const rooms = getRooms(res.socket.server.io);
    // const roomList = await Promise.all(rooms.map(room=>getRoomName(room)));
    const roomsWithName = await Promise.all(rooms.map(room=>getRoom(room)));
    const roomList = roomsWithName.map((room)=>{
        return {
            id: room?._id.toHexString(),
            roomName: room?.roomName,
        }
    });
    console.log('rooms:',roomList);
    res.status(201).json({
        rooms: roomList,
    });
  
};
