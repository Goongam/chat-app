import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/router";
import { funcButton } from "@/pages/chat";
import { titleHeight, funcBtnHeight } from "@/constants"

export default function ExitRoomBtn(){
    const {socket, disconnect} = useSocket();
    const router = useRouter();

    const exitRoom = ()=>{
        disconnect();
        router.push('/');
    }

    return (
        <button onClick={exitRoom} style={{height:funcBtnHeight}}>퇴장</button>
    );
    
}