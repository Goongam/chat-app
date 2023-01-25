import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Socket{
    emit: (type: string, req?: {}) => void;
    on: (type: string, callback: (res: any) => void) => void;
    connect: () => void;
}

type Chat = Array<String>;

let socket: Socket;

export default function Home() {
  
  const [inputMsg, setInputMsg] = useState<string>('');
  const [chat, setChat] = useState<Chat>([]);
  

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
  }

  const sendMsg = () =>{
    socket.emit("chat", inputMsg);
    setInputMsg("");
  }

  return (
    <>
      index
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
