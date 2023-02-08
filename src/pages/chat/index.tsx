import Chatting from "@/components/Chatting";
import ExitRoomBtn from "@/components/ExitRoomBtn";
import InviteBtn from "@/components/InviteBtn";
import RoomMembers from "@/components/RoomMembers";
import { SubmitBtn } from "@/components/SubmitBtn";
import { useSocket } from "@/hooks/useSocket";

import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Room } from "..";

export default function ChatRoom({host}: InferGetServerSidePropsType<typeof getServerSideProps>){

    

    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string | null>('');
    const [roomIndex, setRoomIndex] = useState<string|string[]|undefined>('');

    const router = useRouter();
    let {room, create} = router.query;
    
    const {socket, disconnect} = useSocket();

    const joinRoom = useCallback((type: 'join'|'create') =>{
        const inputName = prompt('사용할 이름을 입력해 주세요');
        if(!inputName){
            disconnect();
            router.push('/');
            return;
        }
        setUserName(inputName);

        if(type === 'join'){
            socket.emit('join',inputName,'',room);
            setRoomIndex(room);
        }else{
            socket.emit('create',inputName,room);
        }

    },[room, router, socket, disconnect]);


    const socketInit = useCallback(async () =>{
        console.log('연결');

        //url접근
        const {rooms} = await(await fetch('/api/rooms')).json();

        if(rooms.map((room:Room)=>room.id).includes(room)){ //방 O
            joinRoom('join');

        }else{ //방X
            if(create === 'true'){
                joinRoom('create');
                
            }else{
                alert('존재하지 않는 채팅방 입니다.');
                router.push('/');
                return;
            }
        }
    
        socket.on('roomChanged', (roomName) => {
            setRoomName(roomName);
        });
        socket.on('roomIndex',(roomIndex)=>{
            setRoomIndex(roomIndex);
        });

        window.onpopstate = e => {
            disconnect();
        };

    },[create, joinRoom, room, router, socket, disconnect]); 

    useEffect(()=>{
        if(room) socketInit();
    },[room, create, socketInit]);
    
    if(!room) return <>찾을 수 없는 채팅 방</>;

    return (
    <>
        <h4>방:{roomName}</h4>
        <SubmitBtn roomIndex={roomIndex} />
        <ExitRoomBtn />
        <InviteBtn host={host} roomIndex={roomIndex} />       
        <RoomMembers />
        <Chatting userName={userName}/>
    </>
    );
}


export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    const host = req.headers.host

    // const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    return {
      props: {
        host
      },
    }
  }