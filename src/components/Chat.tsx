import { Chat } from "@/pages/api/types/chat";
import styled from "styled-components";
import css from "styled-jsx/css";

const Name = styled.div`
    font-size: 13px;
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

    ${Name}{
        margin-top: ${ (props)=> props.mine ? '15px' : '10px' }
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
                <Name>{isMine ? '' : userName}</Name>
                <Message>{message}</Message>
            </Content>
        </Line>
    );
}