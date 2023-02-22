import { useSocket } from "@/hooks/useSocket";
import { RoomIndex } from "@/pages/api/types/chat";
import { useState, useEffect } from "react";
import { SubmitBtn } from "./SubmitBtn";

interface RoomIndexObj{
    roomIndex:RoomIndex,
}


export default function AiSubmit({roomIndex}: RoomIndexObj){
    const [inputMsg, setInputMsg] = useState<string>('');
    const [isChatActive, setIsChatActive] = useState<boolean>(true);
    const {socket} = useSocket();

    useEffect(()=>{
        socket.on('chat',(userName)=>{ 
            if(userName === 'AI') setIsChatActive(true);
        });
    },[socket]);


    const sendMsg = (inputMsg:string) =>{
        if(inputMsg && isChatActive){
            socket.emit("chat", inputMsg, `${roomIndex}`);
            setInputMsg("");
            setIsChatActive(false);
        }     
      }

    return (
        <SubmitBtn inputMsg={inputMsg} setInputMsg={setInputMsg} sendMsg={sendMsg}/>
    );
}