import { useSocket } from "@/hooks/useSocket";
import { Chats, UserName } from "@/pages/api/types/chat";
import {useEffect, useState} from 'react';
import styled from "styled-components";
import Chat from "./Chat";
import {CHATINPUTSIZE, funcBtnHeight, memberListHeight, titleHeight} from "../constants";

const ChatContent = styled.div`
    /* margin: 0 10px 10px 10px; */
    width: 100%;
`;

const ScrollDiv = styled.div`
    overflow-y: scroll;

    /* height: calc(100vh - ${CHATINPUTSIZE}px - ${funcBtnHeight}px - ${titleHeight}px - 33px); */
    width: 100%;
    display:flex;
    flex-direction: column-reverse;
    -ms-overflow-style: none;
    ::-webkit-scrollbar{
        display: none;
    }

`;

const chatTypeNick = {
    'random':'상대방',
    'ai':'AI',
};

export default function Chatting({userName, chatInit = [], chatType = 'normal'}: UserName){
    const [chat, setChat] = useState<Chats>(chatInit);
    const {socket} = useSocket();

    useEffect(()=>{
        if(!userName) return;

        socket.on('chat', (name, message) => {             
            setChat((prev) => [...prev, {userName: name, message, type:'chat'}]);
        });
        socket.on('notice', (message)=>{
            setChat((prev) => [...prev, {message, type:'notice'}]);
        });
        socket.on('notice-random',(message)=>{
            setChat((prev) => [...prev, {message, type:'notice'}]);
        });
        socket.on('random-join',(message)=>{
            setChat( [{message, type:'notice'}] );
        });
        socket.on("disconnect", (reason) => {
            setChat((prev) => [...prev, {message:`서버와 연결이 끊어졌습니다:${reason}`, type:'notice', error:true}]);
        });
        socket.io.on('reconnect', () => {
            setChat((prev) => {
                return [...prev, {message:`재 연결 되었습니다`, type:'notice'}]
            });
        });
        
    },[socket, userName]);


    return(
        <ScrollDiv>
            <ChatContent>
            {chat.map((chat, index) =>   
                (
                    <Chat 
                        key={index} 
                        userName={chatType === 'normal' ? chat.userName : chatTypeNick[chatType]} 
                        message={chat.message} 
                        isMine={userName === chat.userName} 
                        type={chat.type} 
                    />
                )
            )}
        </ChatContent>
        </ScrollDiv>
        
    );
}