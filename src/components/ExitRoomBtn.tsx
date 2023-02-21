import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/router";
import { titleHeight, funcBtnHeight } from "@/constants"
import styled from "styled-components";


export const FuncButton = styled.button`
    /* height: 10px; */
    border-color: rgb(101, 223, 111);
    background-color: rgba(83, 228, 43, 0.364);
    border-radius: 3px;
`

export default function ExitRoomBtn(){
    const {socket, disconnect} = useSocket();
    const router = useRouter();

    const exitRoom = ()=>{
        disconnect();
        router.push('/');
    }

    return (
        <FuncButton onClick={exitRoom}>나가기</FuncButton>
    );
    
}