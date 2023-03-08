import Chatting from "@/components/Chatting";
import ExitRoomBtn from "@/components/ExitRoomBtn";
import InviteBtn from "@/components/InviteBtn";
import NormalSubmit from "@/components/NormalSubmit";
import RoomMembers from "@/components/RoomMembers";
import { SubmitBtn } from "@/components/SubmitBtn";
import { namespaces } from "@/constants";
import { useSocket } from "@/hooks/useSocket";
import { Chat } from "@/pages/api/types/chat";

import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ChatContainer, ChatDiv, RoomTitle } from "..";
import { Room } from "../..";
import AiSubmit from '../../../components/AiSubmit';

export default function ChatRoom(){

    

    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string | null>('');
    const [roomIndex, setRoomIndex] = useState<string|string[]|undefined>('');

    const router = useRouter();

    const {socket, disconnect} = useSocket(namespaces.ai);

    const socketInit = useCallback(async () =>{

        setUserName('me');

        socket.on('roomChanged', (roomName) => {
            setRoomName(roomName);
        });
        socket.on('roomIndex',(roomIndex)=>{  
            setRoomIndex(roomIndex);
        });
        // socket.io.on('reconnect',()=>{
        //     console.log('reconnect!');
        // });

        window.onpopstate = e => {
            disconnect();
        };

    },[]); 

    useEffect(()=>{
        socketInit();
    },[socketInit]);
    
    // if(!room) return <>찾을 수 없는 채팅 방</>;
    const ChatInit:Chat = {
        message: 'AI채팅',
        type:'notice',
    }
    return (
    <ChatContainer>
        <RoomTitle>AI채팅</RoomTitle>
        <ExitRoomBtn />
        <ChatDiv>
            
            <Chatting userName={userName} chatType='ai'/>
        </ChatDiv>
        
        <AiSubmit roomIndex={roomIndex} />
    </ChatContainer>
    );
}
