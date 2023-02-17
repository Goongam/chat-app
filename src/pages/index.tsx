import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import {BiRefresh} from 'react-icons/bi';
import {AiFillLock} from 'react-icons/ai';

const StyleButton = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  background-color: white;
  color: ${props => props.color};
  border: 2px solid ${props => props.color};
`;
const ReFreshDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const RoomInfo = styled.div`
  display: inline-block;
`
const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

`;
const Room = styled.div`
  width: 75%;
  border-bottom: 1px solid rgb(175, 171, 171);
  padding: 5px 0 5px 0;

  display: flex;
  justify-content: space-between;
  &:first-child{
    border-top: 1px solid rgb(175, 171, 171);
  }
  &:last-child{
    border-bottom: none;
  }
`;

export const RoomName = styled.div`
  /* margin-left: 5px; */
  width: fit-content;
  max-width: 300px;
  white-space: normal;
  word-break: break-all;
  text-align: left;
`;
const RoomMember = styled.span`
`;

export interface Room{
  id: string,
  roomName: string,
  members: number,
  isPass: boolean,
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
    const password = prompt('방 비밀번호 입력');
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
            password,
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
      {/* <StyleButton onClick={setRoomlist} color='mediumseagreen'>방목록</StyleButton> */}
      <StyleButton onClick={joinRandomChat} color='mediumseagreen'>랜덤채팅</StyleButton>
      <ReFreshDiv>
        <RoomInfo>
          생성된 방:{roomList?.length}
        </RoomInfo>
        <BiRefresh size={25} onClick={setRoomlist}/>
      </ReFreshDiv>
      <RoomList>
      {
              roomList?.map((room, index) => {

                  return(
                    <Room key={index} color='mediumseagreen'>
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
                        <RoomName>
                          {room.isPass && <AiFillLock />}
                          {room.roomName}
                        </RoomName>
                      
                      </Link>
                    <RoomMember>{room.members}명</RoomMember>
                    </Room>
                  );
              })
            }
      </RoomList>
    </>
  )
}
