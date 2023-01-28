import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "../types/chat";

export default function UserList(req: NextApiRequest, res:NextApiResponseServerIO){
    if(typeof req.query.room === 'string'){

        console.log(res.socket.server.io.of('/').adapter.rooms.get(req.query.room));

        res.status(200).send('OK');
        return;
    }

    res.status(400).send('ERROR');
    
    // console.log(req.query.room);
    

    
    
}