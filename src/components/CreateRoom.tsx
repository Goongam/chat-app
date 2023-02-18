import useInput from "@/hooks/useInput";
import { useState } from "react";
import { useRouter } from "next/router";


export default function CreateRoom(){
    const [title, titleHandleChange] = useInput('');
    const [password, passwordHandleChange] = useInput('');
    const [passIsCheck, setPassIsCheck] = useState(false);
    const router = useRouter();
    

    const createRoom = ()=>{
        if(!title){
            return;
        }
        if(passIsCheck && !password){
            return;
        }

        router.push({
            pathname:'chat',
            query: {
                room: title,
                create: true,
                password: passIsCheck ? password : '',
            },
           },
           `/`);

        
    }
//TODO: password 체크 활성화/비활성화,  CSS
    return(
    <>
        <div>방 만들기</div>
        <div>
            방제목: <input type={'text'} value={title} onChange={titleHandleChange}></input>
        </div>
        <input type={'checkbox'} onChange={(e)=>setPassIsCheck(e.target.checked)}></input>
        <div>
            비밀번호: <input type={'text'} value={password} onChange={passwordHandleChange}></input>
        </div>
        <div>
            <button onClick={createRoom}>생성</button>
        </div>
    </>);
}