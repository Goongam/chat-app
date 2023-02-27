import Chatting from "@/components/Chatting";
import ExitRoomBtn from "@/components/ExitRoomBtn";
import InviteBtn from "@/components/InviteBtn";
import NormalSubmit from "@/components/NormalSubmit";
import RoomMembers from "@/components/RoomMembers";
import { SubmitBtn } from "@/components/SubmitBtn";
import { useSocket } from "@/hooks/useSocket";

import { GetServerSideProps, GetServerSidePropsContext, GetStaticPropsContext, InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Room } from "..";
import { titleHeight, funcBtnHeight } from "../../constants"

export const RoomTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    height: ${titleHeight}px;
`;

const FuncButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 4px;

    height: ${funcBtnHeight}px;

    padding: 0 4px 0 4px;
`

export const ChatDiv = styled.div`
    display: flex;
    position: relative;
    flex:1;
    overflow: hidden;
    margin-bottom: 3px;
`
export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 2px;
`

export default function ChatRoom(){

    

    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string | null>('');
    const [roomIndex, setRoomIndex] = useState<string|string[]|undefined>('');

    const router = useRouter();
    let {room, create, password} = router.query;
    
    const {socket, disconnect} = useSocket();


    const exitRoom = useCallback((message?:string) => {
        disconnect();
        if(message) alert(message);
        router.push('/');
    },[disconnect, router]);
    
    const joinRoom = useCallback((type: 'join'|'create') =>{
        let inputName:string|null = ''
        do{
            inputName = prompt('사용할 이름을 입력해 주세요');
        }while(inputName && 10 <= inputName?.length)

        if(!inputName){
            exitRoom();
            return;
        }
        setUserName(inputName);

        if(type === 'join'){
            socket.emit('join',inputName,'',room);
            setRoomIndex(room);
        }else{
            socket.emit('create',{
                userName: inputName,
                roomName: room,
                password,
            });
        }

    },[exitRoom, socket, room, password]);

    const verityRoom = async (currentRoom:Room)=>{
        if(!currentRoom.isPass){
            return true;
        }

        const inputpass = prompt('비밀번호를 입력해주세요');
        
        if(!inputpass) {
            return false;
        }

        const {verify} = await (await fetch('/api/verity',{
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomid: currentRoom.id,
                inputpass
            }),
        })).json().catch(()=>{return false});

        
        if(verify === 'wrong'){
            return false;
        }

        return true;

    }


    const socketInit = useCallback(async () =>{
        console.log('연결');

        //url접근
        
        const roomdata = await(await fetch('/api/rooms')).json();
        const rooms:Room[] = roomdata.rooms;
        
        // if(rooms.map((room:Room)=>room.id).includes(room as string)){ //방 O
        const currentRoom = rooms.find(e => e.id === room);
        if(currentRoom){ //방 O
            const verity = await verityRoom(currentRoom);
            if(verity) joinRoom('join');
            else{
                exitRoom('비밀번호가 틀렸습니다');
                return;
            }

        }else{ //방X
            if(create === 'true'){
                joinRoom('create');
                
            }else{
                exitRoom('존재하지 않는 채팅방 입니다.');
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

    },[socket, room, joinRoom, exitRoom, create, disconnect]); 

    useEffect(()=>{
        if(room) socketInit();
    },[room, create, socketInit]);
    
    if(!room) return <>찾을 수 없는 채팅 방</>;

    return (
    <ChatContainer>
        <RoomTitle>{roomName}</RoomTitle>

        <FuncButtons>
            <InviteBtn roomIndex={roomIndex} />
            <ExitRoomBtn />
        </FuncButtons>    
        
        <ChatDiv>
            <RoomMembers />
            <Chatting userName={userName}/>
        </ChatDiv>

        <NormalSubmit roomIndex={roomIndex} />

    </ChatContainer>
    );
}


// export async function getServerSideProps({ req }: GetServerSidePropsContext) {
//     const host = req.headers.host

//     // const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
//     return {
//       props: {
//         host
//       },
//     }
//   }