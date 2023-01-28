import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import io from "socket.io-client";


export default function Home() {
  
  // const [room, setRoom] = useState("null");
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
    // socket.emit('createRoom',room,inputRoom);
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
            createRoom: true,
        },
       },
       `/`);

  }

  return (
    <>
      {/* <input 
        type={"Text"}
        onChange={(e)=>{setInputRoom(e.target.value)}}
        value={inputRoom}
      /> */}
      <button onClick={createRoom}>방만들기</button>
      <button onClick={roomlist}>방목록</button>
      {
        roomList?.map((r, index) => {

            return(
              <div key={index}>
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
              </div>
            );
          
          
        })
      }
    </>
  )
}
