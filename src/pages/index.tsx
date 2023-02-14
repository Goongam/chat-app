import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const StyleButton = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  background-color: white;
  color: ${props => props.color};
  border: 2px solid ${props => props.color};
`;
const RoomListWrap = styled.div`
  display: flex;
  justify-content: center;
`;
const RoomList = styled.div`
  width: 75%;

  border: 2px solid ${props => props.color};
`;

export interface Room{
  id: string,
  roomName: string,
  members: number,
}

export default function Home() {

  const [roomList, setRoomList] = useState<Room[]>();
  
  const router = useRouter();

  
  useEffect(()=>{
    (async () => {
        await fetch("/api/socketio");
    })();
  },[])

  const setRoomlist = async()=>{
    // socket.emit('rooms');
    const {rooms} = await(await fetch('/api/rooms')).json();
    setRoomList(rooms);
  }

  const createRoom = async() =>{
    const roomName = prompt('방제목 입력');
    if(roomName === null) return;

    // const {rooms} = await(await fetch('/api/rooms')).json();
    // if(rooms.includes(roomName)){
    //     alert('중복된 방제목');
    //     return; 
    // }

    router.push({
        pathname:'chat',
        query: {
            room: roomName,
            create: true,
        },
       },
       `/`);

  }

  const joinRandomChat = ()=>{
    router.push({
      pathname:'chat/random',
     },
     `/`);
  }

  return (
    <>
      <StyleButton onClick={createRoom} color='mediumseagreen'>방만들기</StyleButton>
      <StyleButton onClick={setRoomlist} color='mediumseagreen'>방목록</StyleButton>
      <StyleButton onClick={joinRandomChat} color='mediumseagreen'>랜덤채팅</StyleButton>
      <RoomListWrap>
      {
              roomList?.map((room, index) => {

                  return(
                    <RoomList key={index} color='mediumseagreen'>
                      <Link 
                    href={{
                      pathname:'chat',
                      query: {
                          room: room.id,
                          // createRoom: true,
                      },
                    }}
                    as={'/'}
                    >
                      {room.roomName} / {room.members}
                    </Link>
                    </RoomList>
                  );
              })
            }
      </RoomListWrap>
    </>
  )
}
