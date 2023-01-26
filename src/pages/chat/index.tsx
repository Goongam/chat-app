import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


let socket: Socket;

type Chat = Array<string>

export default function Room(){

    const [inputMsg, setInputMsg] = useState<string>('');
    const [chat, setChat] = useState<Chat>([]);

    const router = useRouter();
    const {room, createRoom} = router.query;

//TODO: 유저이름 추가
    useEffect(()=>{
        if(room) socketInit();
    },[room, createRoom]);

    const socketInit = async () =>{
        console.log('연결');

        const userName = prompt('사용할 이름을 입력해 주세요') || '';

        // await fetch("/api/socketio");
        socket = io({
        path: "/api/socketio",
        });

        socket.connect();

        //방 생성 버튼
        if(createRoom === 'true')
        socket.emit('join','',room);
        //url접근
        else{
            const {rooms} = await(await fetch('http://localhost:3000/api/rooms')).json();
            if(rooms.includes(room)){ //방 O
                socket.emit('join','',room);
            }else{ //방X
                alert('존재하지 않는 채팅방 입니다.');
                router.push('/');
            }
        }


        socket.on('chat', (message) => {
        setChat((prev) => [...prev, message]);

        })

        socket.on('pchat', (message) => {

        });

        window.onpopstate = e => {
        socket.close();
        };
    //   socket.on('rooms', (rooms)=>{
    //     setRoomList(rooms);
    //   });
  
    //   socket.on('roomChanged',(newRoom) => {
    //     setRoom(newRoom);
    //   });
    }

    const sendMsg = () =>{
        socket.emit("chat", inputMsg, room);
        setInputMsg("");
      }

    if(!room) return <>찾을 수 없는 채팅 방</>;

    return (
    <>
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
    );
}


export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    const forwarded = req.headers['x-forwarded-for'];

    // const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    return {
      props: {
        // ip,
      },
    }
  }