import { useSocket } from '@/hooks/useSocket';
import {useState, useEffect} from 'react';
import styled from 'styled-components';

const Members = styled.div<{isOpen:boolean}>`
    height: ${props => props.isOpen ? '100px' : '30px'};
    border: 1px solid black;
    transition-duration: 0.1s;
    transition-property: height;
    /* overflow-y: scroll; */
    display: flex;
`;

const MemberList = styled.div`
    overflow-y: scroll;
    height: 100px;
    width: 500px;
`

export default function RoomMembers(){

    const [members, setMembers] = useState([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {socket} = useSocket();

    useEffect(()=>{
        socket.on('members',(members)=>{
            setMembers(members);
        });

    },[socket]);

    return (

        <Members isOpen={isOpen}>
            <button onClick={()=>{setIsOpen(!isOpen)}}>
                {isOpen ? '▲' : '▼'}
            </button>
            {
                isOpen ?    
                    <MemberList>
                        {members.map((member)=>(<div key={member}>{member}</div>)) }
                    </MemberList>
                :
                    members.length + '명'
            }
        </Members>

        
    );
}