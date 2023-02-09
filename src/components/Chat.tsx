import { Chat } from "@/pages/api/types/chat";
import styled from "styled-components";
import css from "styled-jsx/css";

const Name = styled.div`
    /* display: flex; */
`
const Message = styled.div`
    /* display: flex; */
    width: fit-content;
    max-width: 300px;
    white-space: normal;
    word-break: break-all;

    background-color: aquamarine;
    border-radius: 4px;
    padding: 5px;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
`

const Line = styled.div<{ mine: boolean|undefined }>`
    display: flex;
    justify-content: ${ (props)=> props.mine ? `end` : `start` };

    ${Content}{
        align-items: ${ (props)=> props.mine ? `flex-end` : `flex-start` };
    }
`;





export default function Chatting({userName, message, isMine, type}:Chat){
    
    if(type === 'notice'){
        return(
            <div style={{display:'block'}}>
                {message}
            </div>
        );
    }
    return (
        <Line mine={isMine}>
            <Content>
                <Name>{userName}</Name>
                <Message>{message}</Message>
            </Content>
        </Line>
    );
}