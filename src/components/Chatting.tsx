import { useSocket } from "@/hooks/useSocket";
import { Chats, UserName } from "@/pages/api/types/chat";
import {useEffect, useState} from 'react';
import styled from "styled-components";
import Chat from "./Chat";

const ChatContent = styled.div`
    margin: 10px;
`;

export default function Chatting({userName}: UserName){
    const [chat, setChat] = useState<Chats>([]);
    const {socket} = useSocket();

    useEffect(()=>{
        socket.on('chat', (userName, message) => {
            setChat((prev) => [...prev, {userName, message}]);

        })
    },[socket]);


    return(
        //TODO: 입장, 퇴장 메시지 따로 표시
        //TODO: member drawer 구현
        //input css
        <ChatContent>
            {chat.map((chat, index) => (
                <Chat key={index} name={chat.userName} message={chat.message} isMine={userName === chat.userName}></Chat>
            ))}
        </ChatContent>
    );
}