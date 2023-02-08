import { useSocket } from '@/hooks/useSocket';
import {useState, useEffect} from 'react';

export default function RoomMembers(){

    const [members, setMembers] = useState([]);
    const {socket} = useSocket();

    useEffect(()=>{
        socket.on('members',(members)=>{
            setMembers(members);
        });

    },[socket]);

    return (
        <div>
            {
                members.map((member)=>(<div key={member}>{member}</div>))
            }
    </div>
    );
}