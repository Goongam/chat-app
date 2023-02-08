import { useSocket } from "@/hooks/useSocket";
import { Chats } from "@/pages/api/types/chat";
import {useEffect, useState} from 'react';

export default function Chatting(){
    const [chat, setChat] = useState<Chats>([]);
    const {socket} = useSocket();

    useEffect(()=>{
        socket.on('chat', (userName, message) => {
            setChat((prev) => [...prev, {userName, message}]);

        })
    },[socket]);


    return(
        <div>
            {chat.map((chat, index) => (
                <div key={index}>{chat.userName}: {chat.message}</div>
            ))}
        </div>
    );
}