import { useSocket } from '@/hooks/useSocket';
import {useState, useEffect} from 'react';
import styled from 'styled-components';
import {memberListHeight} from '@/constants';

const Members = styled.div<{isOpen:boolean}>`
    height: ${props => props.isOpen ? '100px' : `${memberListHeight}px`};
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    transition-duration: 0.1s;
    transition-property: height;
    /* overflow-y: scroll; */
    display: flex;
    width:calc(100%);
    background-color:white;
    position:absolute;
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