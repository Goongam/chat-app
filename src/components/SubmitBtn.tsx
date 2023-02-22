import { useSocket } from "@/hooks/useSocket";
import { RoomIndex } from "@/pages/api/types/chat";
import { Dispatch, SetStateAction, useState } from "react"
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

interface Props{
    inputMsg:string,
    setInputMsg:Dispatch<SetStateAction<string>>,
    sendMsg: (arg0: string)=>void,
}

export function SubmitBtn({inputMsg, setInputMsg, sendMsg}:Props){

    return(
        <InputDiv>
            <InputText 
                    type={"Text"}
                    onChange={(e)=>{setInputMsg(e.target.value)}}
                    onKeyDown={(e)=>{
                        if(e.key === 'Enter') sendMsg(inputMsg);
                    }}
                    value={inputMsg}
            />
            <Submit onClick={()=>sendMsg(inputMsg)}>전송</Submit>
        </InputDiv>
    );
}