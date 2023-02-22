import { useSocket } from "@/hooks/useSocket";
import { RoomIndex } from "@/pages/api/types/chat";
import { useState } from "react";
import { SubmitBtn } from "./SubmitBtn";

interface RoomIndexObj{
    roomIndex:RoomIndex,
}


export default function NormalSubmit({roomIndex}: RoomIndexObj){
    const [inputMsg, setInputMsg] = useState<string>('');
    const {socket} = useSocket();

    const sendMsg = (inputMsg:string) =>{
        
        if(inputMsg){
            socket.emit("chat", inputMsg, `${roomIndex}`);
            setInputMsg("");
        }     
      }

    return (
        <SubmitBtn inputMsg={inputMsg} setInputMsg={setInputMsg} sendMsg={sendMsg}/>
    );
}