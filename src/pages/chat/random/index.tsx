import Chatting from "@/components/Chatting";
import ExitRoomBtn from "@/components/ExitRoomBtn";
import InviteBtn from "@/components/InviteBtn";
import RoomMembers from "@/components/RoomMembers";
import { SubmitBtn } from "@/components/SubmitBtn";
import { useSocket } from "@/hooks/useSocket";
import { Chat } from "@/pages/api/types/chat";

import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ChatContainer, ChatDiv, RoomTitle } from "..";
import { Room } from "../..";

export default function ChatRoom(){

    

    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string | null>('');
    const [roomIndex, setRoomIndex] = useState<string|string[]|undefined>('');

    const router = useRouter();

    const {socket, disconnect} = useSocket('/random');



    const socketInit = useCallback(async () =>{

        socket.on('roomChanged', (roomName) => {
            setRoomName(roomName);
        });
        socket.on('roomIndex',(roomIndex)=>{  
            setRoomIndex(roomIndex);
        });
        socket.on('userName',(name)=>{
            setUserName(name);
        })

        window.onpopstate = e => {
            disconnect();
        };

    },[]); 

    useEffect(()=>{
        socketInit();
    },[socketInit]);
    
    // if(!room) return <>찾을 수 없는 채팅 방</>;
    const ChatInit:Chat = {
        message: '대화 상대 찾는 중...',
        type:'notice',
    }
    return (
    <ChatContainer>
        <RoomTitle>랜덤채팅</RoomTitle>
        <ExitRoomBtn />
        <ChatDiv>
            
            <Chatting userName={userName} chatInit={[ChatInit]} chatType='random'/>
        </ChatDiv>
        
        <SubmitBtn roomIndex={roomIndex} />
    </ChatContainer>
    );
}
