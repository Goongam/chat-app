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

type Chats = Array<Chat>;
// let ;
export default function Room({host}: InferGetServerSidePropsType<typeof getServerSideProps>){

    const [inputMsg, setInputMsg] = useState<string>('');
    const [chat, setChat] = useState<Chats>([]);
    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string | null>('');
    const [roomIndex, setRoomIndex] = useState<string|string[]|undefined>('');

    const router = useRouter();
    let {room, create} = router.query;
    
//TODO: 소켓 훅으로 만들기, 버튼, input 컴포넌트화 
    const joinRoom = useCallback(() =>{
        const inputName = prompt('사용할 이름을 입력해 주세요');
        if(!inputName){
            router.push('/');
            return;
        }
        setUserName(inputName);
        socket.emit('join',inputName,'',room);

        //roomindex
        setRoomIndex(room);
    },[room, router]);

    const createRoom = useCallback(() =>{
        const inputName = prompt('사용할 이름을 입력해 주세요');
        if(!inputName){
            router.push('/');
            return;
        }
        setUserName(inputName);
        socket.emit('create',inputName,room);

    },[room, router]);

    const socketInit = useCallback(async () =>{
        console.log('연결');

        // await fetch("/api/socketio");
        socket = io({
            path: "/api/socketio",
        });
        socket.connect();

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
            setRoomName(roomName);
        });
        socket.on('roomIndex',(roomIndex)=>{
            console.log('roomIndex:',roomIndex)
            setRoomIndex(roomIndex);
        });

        window.onpopstate = e => {
            socket.close();
        };

    },[create, createRoom, joinRoom, room, router]); 

    useEffect(()=>{
        if(room) socketInit();
    },[room, create, socketInit]);




    const sendMsg = () =>{
        if(inputMsg){
            socket.emit("chat", inputMsg, userName, `${roomIndex}`);
            setInputMsg("");
        }     
      }
    const exitRoom = ()=>{
        socket.close();
        router.push('/');
    }
    const invite = () =>{
        const url = `${host}/invite/${roomIndex}`;
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