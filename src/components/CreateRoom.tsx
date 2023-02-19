import useInput from "@/hooks/useInput";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

const InputForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    margin-left: 10px;
    margin-right: 10px;
    gap: 10px;
`

const Input = styled.input`
    width: 100%;
    height: 30px;
    box-sizing: border-box; 
`

const ConfirmDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`

const Confirm = styled.button`
    border: none;
    border-radius: 2px;
    background-color: rgb(76, 196, 98);
    color: white;
    width: 50px;
    height: 30px;
`;

export default function CreateRoom(){
    const [title, titleHandleChange] = useInput('');
    const [password, passwordHandleChange] = useInput('');
    const router = useRouter();

    const titleRef = useRef<HTMLInputElement>(null);

    const createRoom = ()=>{
        if(!title){
            if(titleRef.current) titleRef.current.focus();
            return;
        }

        if(30 < title.length){
            if(titleRef.current) titleRef.current.focus();
            return;
        }

        router.push({
            pathname:'chat',
            query: {
                room: title,
                create: true,
                password
            },
           },
           `/`);

        
    }
//TODO: password 체크 활성화/비활성화,  CSS
//TODO: 스크롤 방지
    return(
    <>
        <div>방 만들기</div>
        <InputForm>
            <div>방제목</div>
            <Input ref={titleRef} type={'text'} value={title} onChange={titleHandleChange}></Input>

            <div>비밀번호</div> 
            <Input 
                type={'text'} 
                value={password} 
                onChange={passwordHandleChange}
                ></Input>
            <ConfirmDiv>
                <Confirm onClick={createRoom}>확인</Confirm>
            </ConfirmDiv>
        </InputForm>
        
    </>);
}