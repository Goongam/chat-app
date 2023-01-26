import Link from "next/link";
import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Socket{
    emit: (type: string, req?: {}, req2?:{}) => void;
    on: (type: string, callback: (res: any) => void) => void;
    connect: () => void;
}

type Chat = Array<string>;

let socket: Socket;

export default function Home() {
  
  const [inputMsg, setInputMsg] = useState<string>('');
  const [inputRoom, setInputRoom] = useState<string>('');
  const [chat, setChat] = useState<Chat>([]);
  const [room, setRoom] = useState("null");
  const [roomList, setRoomList] = useState<string[]>();
  


  useEffect(()=>{socketInit()},[]);
  
  const socketInit = async () =>{
    console.log('연결');
    // await fetch("/api/socketio");
    socket = io({
      path: "/api/socketio",
    });

    socket.connect();


    socket.on('chat', (message) => {
      setChat((prev) => [...prev, message]);

    })

    socket.on('pchat', (message) => {
      console.log(message);
    });

    socket.on('rooms', (rooms)=>{
      setRoomList(rooms);
    });

    socket.on('roomChanged',(newRoom) => {
      setRoom(newRoom);
    });
  }

  const sendMsg = () =>{
    socket.emit("chat", inputMsg, room);
    setInputMsg("");
  }

  const joinRoom = (newRoom: string) =>{
    socket.emit('join',room,newRoom);
  }

  const roomlist = async()=>{
    // socket.emit('rooms');
    const {rooms} = await(await fetch('http://localhost:3000/api/rooms')).json();
    setRoomList(rooms);
  }

  const createRoom = () =>{
    socket.emit('createRoom',room,inputRoom);
  }

  return (
    <>
      index
      <Link href={'/about'}>about</Link>
      <input 
        type={"Text"}
        onChange={(e)=>{setInputRoom(e.target.value)}}
        value={inputRoom}
      />
      <button onClick={createRoom}>방만들기</button>

      <button onClick={roomlist}>방목록</button>
      {
        roomList?.map((r, index) => {
          if(room !== r){
            return(
              <div key={index}>
              {r}
              <button onClick={()=>{joinRoom(r)}}>입장</button>
            </div>
            );
          }
          
        })
      }
      <h4>방:{room}</h4>
      <input 
        type={"Text"}
        onChange={(e)=>{setInputMsg(e.target.value)}}
        value={inputMsg}
      />
      <button onClick={sendMsg}>전송</button>
      <div style={{width:"300px", border:"1px solid black", minHeight:"100px"}}>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </>
  )
}
