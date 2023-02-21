import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import io from "socket.io-client";
import styled, {keyframes} from "styled-components";
import {BiRefresh} from 'react-icons/bi';
import {AiFillLock, AiOutlineLoading3Quarters} from 'react-icons/ai';
import Modal from "@/components/Modal";
import CreateRoom from "@/components/CreateRoom";
import { useFetchRooms } from "@/hooks/useFetchRooms";

const StyleButton = styled.button`
  font-size: 1em;
  margin: 0 2em 0 2em;
  padding: 0.25em 1em;
  border-radius: 3px;
  background-color: white;
  color: ${props => props.color};
  border: 2px solid ${props => props.color};

  :first-child{
    margin-top: 10px;
  }
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
  flex: 1;

  overflow: scroll;
  ::-webkit-scrollbar{
        display: none;
    }
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

const rotation = keyframes`
    from {-webkit-transform: rotate(0deg);}
    to   {-webkit-transform: rotate(359deg);}
`

const Loading = styled.div`
  .loadingIcon{
    animation: ${rotation} 1s infinite;
  }
`

const HomeStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  gap: 10px;

`

export interface Room{
  id: string,
  roomName: string,
  members: number,
  isPass: boolean,
}

export default function Home() {

  const [roomList, setRoomList] = useState<Room[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const {rooms, isLoading, refetch} = useFetchRooms();
  
  useEffect(()=>{
    (async () => {
        await fetch("/api/socketio");

    })();
  },[])

  const setRoomlist = ()=>{
    refetch();
  }

  const joinRandomChat = ()=>{
    router.push({
      pathname:'chat/random',
     },
     `/`);
  }



  return (
    <HomeStyle>
      {modalOpen && <Modal setModalOpen={setModalOpen}><CreateRoom /></Modal>}
      <StyleButton onClick={()=>setModalOpen(true)} color='mediumseagreen'>방만들기</StyleButton>
      <StyleButton onClick={joinRandomChat} color='mediumseagreen'>랜덤채팅</StyleButton>

      <ReFreshDiv>
        <RoomInfo>
          생성된 방:{roomList?.length ?? 0}
        </RoomInfo>
        <BiRefresh size={25} onClick={setRoomlist}/>
      </ReFreshDiv>
      
      {
        isLoading ? 
        <Loading>
          <AiOutlineLoading3Quarters className="loadingIcon" />
        </Loading>
        :
        <RoomList>
          {
            rooms?.map((room, index) => {

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
      } 
    </HomeStyle>
  )
}
