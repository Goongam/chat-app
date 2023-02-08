import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/router";

export default function ExitRoomBtn(){
    const {socket, disconnect} = useSocket();
    const router = useRouter();

    const exitRoom = ()=>{
        disconnect();
        router.push('/');
    }

    return (
        <button onClick={exitRoom}>퇴장</button>
    );
    
}