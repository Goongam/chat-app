import { NextApiRequest } from "next";
import { getRooms } from "./util";
import { NextApiResponseServerIO } from "./types/chat";
import { getRoom, getRoomName } from "@/lib/dbUtil";



export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO){
    const io = res.socket.server.io;

    const rooms = getRooms(io);

    const roomsWithName = await Promise.all(rooms.map(room=>getRoom(room)));
    
    const roomList = roomsWithName.map((room)=>{
        let roomid = room?._id.toHexString() as string;
        return {
            id: roomid,
            roomName: room?.roomName,
            members: io.of('/').adapter.rooms.get(roomid)?.size,
            isPass: room?.password ? true : false,
        }
    });

    res.status(201).json({
        rooms: roomList,
    });
  
};
