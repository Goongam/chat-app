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


export default function Home() {

  const [roomList, setRoomList] = useState<string[]>();
  
  const router = useRouter();

  
  useEffect(()=>{
    (async () => {
        await fetch("/api/socketio");
    })();
  },[])

  const roomlist = async()=>{
    // socket.emit('rooms');
    const {rooms} = await(await fetch('/api/rooms')).json();
    setRoomList(rooms);
  }

  const createRoom = async() =>{
    const roomName = prompt('방제목 입력');
    if(roomName === null) return;

    const {rooms} = await(await fetch('/api/rooms')).json();
    if(rooms.includes(roomName)){
        alert('중복된 방제목');
        return; 
    }

    router.push({
        pathname:'chat',
        query: {
            room: roomName,
            create: true,
        },
       },
       `/`);

  }

  return (
    <>
      <StyleButton onClick={createRoom} color='mediumseagreen'>방만들기</StyleButton>
      <StyleButton onClick={roomlist} color='mediumseagreen'>방목록</StyleButton>
      <RoomListWrap>
      {
              roomList?.map((r, index) => {

                  return(
                    <RoomList key={index} color='mediumseagreen'>
                      <Link 
                    href={{
                      pathname:'chat',
                      query: {
                          room: r,
                          // createRoom: true,
                      },
                    }}
                    as={'/'}
                    >
                      {r}
                    </Link>
                    </RoomList>
                  );
              })
            }
      </RoomListWrap>
    </>
  )
}
