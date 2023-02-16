import { useSocket } from "@/hooks/useSocket";
import { RoomIndex } from "@/pages/api/types/chat";
import { useState } from "react"
import styled from "styled-components";
import { CHATINPUTSIZE } from "../constants"

const InputDiv = styled.div`
    display: flex;
    border-top: 1px solid black;
`;

const InputText = styled.input`
    margin-left: 10px;
    border: none;
    outline: none;
    width: 100%;
    
    height: 40px;
`;

const Submit = styled.button`
    background-color: antiquewhite;
    border: 0;
    border-radius: 0 0 1rem 0;
    width: ${CHATINPUTSIZE}px;
`
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
        <InputDiv>
            <InputText 
                    type={"Text"}
                    onChange={(e)=>{setInputMsg(e.target.value)}}
                    onKeyDown={(e)=>{
                        if(e.key === 'Enter') sendMsg();
                    }}
                    value={inputMsg}
            />
            <Submit onClick={sendMsg}>전송</Submit>
        </InputDiv>
    );
}