import { Chatting } from "@/pages/api/types/chat";
import styled from "styled-components";
import css from "styled-jsx/css";

const Line = styled.div<{ mine: boolean }>`
    display: flex;
    justify-content: ${ (props)=> props.mine ? `end` : `start` };
`;


const Name = styled.div`
    display: flex;
`
const Message = styled.div`
    width: fit-content;
    max-width: 300px;
    white-space: normal;
    word-break: break-all;

    background-color: aquamarine;
    border-radius: 4px;
    padding: 5px;
`


export default function Chat({name, message, isMine}:Chatting){
    
    return (
        <Line mine={isMine}>
            <div>
                <Name>{name}</Name>
                <Message>{message}</Message>
            </div>
        </Line>
    );
}