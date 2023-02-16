import { useSocket } from "@/hooks/useSocket";
import { Chats, UserName } from "@/pages/api/types/chat";
import {useEffect, useState} from 'react';
import styled from "styled-components";
import Chat from "./Chat";
import {CHATINPUTSIZE, funcBtnHeight, memberListHeight, titleHeight} from "../constants";

const ChatContent = styled.div`
    margin: 0 10px 10px 10px;
`;

const ScrollDiv = styled.div`
    overflow-y: scroll;

    height: calc(100vh - ${CHATINPUTSIZE}px - ${funcBtnHeight}px - ${titleHeight}px - 33px);
    display:flex;
    flex-direction: column-reverse;
    /* overflow-y:auto; */
    -ms-overflow-style: none;
    ::-webkit-scrollbar{
        display: none;
    }

/* height:535px; */
/* [출처] [html/css] css만으로 스크롤바 하단고정하는방법/스크롤하단고정/채팅스크롤구현/챗봇구현/HTML채팅스크롤/scroll 아래|작성자 진짱 */
`;

export default function Chatting({userName, chatInit = []}: UserName){
    const [chat, setChat] = useState<Chats>(chatInit);
    const {socket} = useSocket();

    useEffect(()=>{
        socket.on('chat', (userName, message) => {            
            setChat((prev) => [...prev, {userName, message, type:'chat'}]);
        });
        socket.on('notice', (message)=>{
            setChat((prev) => [...prev, {message, type:'notice'}]);
        });
        
        socket.on('notice-random', (type)=>{
            if(type==='join'){
                setChat([{message:'대화 상대를 찾았습니다', type:'notice'}]);
            }else if(type ==='leave'){
                setChat((prev) => [...prev, {message:'상대방이 퇴장하였습니다', type:'notice'}]);
            }
        })
    },[socket]);


    return(
        <ScrollDiv>
            <ChatContent>
            {chat.map((chat, index) =>   
                (
                    <Chat 
                        key={index} 
                        userName={chat.userName} 
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