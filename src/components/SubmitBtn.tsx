import { useSocket } from "@/hooks/useSocket";
import { RoomIndex } from "@/pages/api/types/chat";
import { useState } from "react"

interface RoomIndexObj{
    roomIndex:RoomIndex,
}

export function SubmitBtn({roomIndex}: RoomIndexObj){
    const [inputMsg, setInputMsg] = useState<string>('');
    const {socket} = useSocket();

    const sendMsg = () =>{
        if(inputMsg){
            socket.emit("chat", inputMsg, `${roomIndex}`);
            setInputMsg("");
        }     
      }

    return(
        <>
            <input 
                    type={"Text"}
                    onChange={(e)=>{setInputMsg(e.target.value)}}
                    value={inputMsg}
            />
            <button onClick={sendMsg}>전송</button>
        </>
    );
}