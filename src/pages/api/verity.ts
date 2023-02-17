

import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from './types/chat';
import { verifyRoom, VerityData } from "@/lib/dbUtil";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === 'GET') return;
    
    const verifydata:VerityData = req.body;
    const verity = await verifyRoom(verifydata);
    if(verity) res.status(200).send({verify:'correct'});
    else res.status(200).send({verify:'wrong'})

    
};
