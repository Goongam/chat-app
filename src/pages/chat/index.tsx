import { doCopy } from "@/util/doCopy";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


let socket: Socket;

interface Chat{
    userName: string,
    message: string,
}

type Chats = Array<Chat>
let userName: string|null;
export default function Room({host}: InferGetServerSidePropsType<typeof getServerSideProps>){

    const [inputMsg, setInputMsg] = useState<string>('');
    const [chat, setChat] = useState<Chats>([]);
    const [roomName, setRoomName] = useState<String>('');

    const router = useRouter();
    let {room, create} = router.query;
    
    const joinRoom = useCallback(() =>{
        userName = prompt('사용할 이름을 입력해 주세요');
        if(!userName){
            router.push('/');
            return;
        }
        socket.emit('join',userName,'',room);
    },[room, router]);

    const createRoom = useCallback(
        () =>{
            userName = prompt('사용할 이름을 입력해 주세요');
            if(!userName){
                router.push('/');
                return;
            }
            socket.emit('create',userName,room);
        },[room, router]);

    const socketInit = useCallback(async () =>{
        console.log('연결');

        // await fetch("/api/socketio");
        socket = io({
            path: "/api/socketio",
        });
        socket.connect();
        //방 생성 버튼
         
        //url접근

        const {rooms} = await(await fetch('/api/rooms')).json();

        if(rooms.includes(room)){ //방 O
            joinRoom();

        }else{ //방X
            if(create === 'true'){
                createRoom();
            }else{
                alert('존재하지 않는 채팅방 입니다.');
                router.push('/');
                return;
            }
        }
    
        socket.on('chat', (userName, message) => {
            setChat((prev) => [...prev, {userName, message}]);

        })
        socket.on('roomChanged', (roomName) => {
            console.log('receiveRoomName:',roomName)
            setRoomName(roomName);
        });

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
    },[create, createRoom, joinRoom, room, router]); 

    useEffect(()=>{
        if(room) socketInit();
    },[room, create, socketInit]);




    const sendMsg = () =>{
        if(inputMsg){
            socket.emit("chat", inputMsg, userName, room);
            setInputMsg("");
        }     
      }
    const exitRoom = ()=>{
        socket.close();
        router.push('/');
    }
    const invite = () =>{
        const url = `${host}/invite/${room}`;
        doCopy(url);
    }
    
    if(!room) return <>찾을 수 없는 채팅 방</>;

    return (
    <>
        <h4>방:{roomName}</h4>
        <input 
            type={"Text"}
            onChange={(e)=>{setInputMsg(e.target.value)}}
            value={inputMsg}
        />
        <button onClick={sendMsg}>전송</button>
        <button onClick={exitRoom}>퇴장</button>
        <button onClick={invite}>초대url복사</button>
        <div>
        {chat.map((chat, index) => (
            <div key={index}>{chat.userName}: {chat.message}</div>
        ))}
        </div>
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