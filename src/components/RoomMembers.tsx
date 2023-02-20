import { useSocket } from '@/hooks/useSocket';
import {useState, useEffect} from 'react';
import styled from 'styled-components';
import {memberListHeight} from '@/constants';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import {BsFillPersonFill} from 'react-icons/bs';

const MemberList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    height: '20vh';
    width: 500px;
    ::-webkit-scrollbar{
        display: none;
    }
`

const Members = styled.div<{isOpen:boolean}>`
    height: ${props => props.isOpen ? '20vh' : `${memberListHeight}px`};
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    transition-duration: 0.1s; 
    transition-property: height;
    /* overflow-y: scroll; */
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    width:calc(100%);
    background-color:white;
    position:absolute;

`;


const DropDownButton = styled.div`
    display:'flex';
    height:'100%'; 
    margin-top:'20px';
`

const MemberLength = styled.div`
    display: flex;
    align-items: center;
    font-size: 17px;
    height: 100%;
    margin-left: 5px;
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

    const dropDownProp = {
        size:'20',
        onClick:()=>{setIsOpen(!isOpen)},
        style:{
            marginRight:'5px',
            marginTop:'5px'
        }
    }

    return (

        <Members isOpen={isOpen}>
            
            {
                isOpen ?    
                    <MemberList>
                        {members.map((member)=>(<div key={member}>{member}</div>)) }
                    </MemberList>
                :
                <MemberLength>
                    {members.length}
                    <BsFillPersonFill size={18}/>
                </MemberLength>
                
                    
            }
            <DropDownButton>
            {
            isOpen ? 
                <AiFillCaretUp {...dropDownProp} /> 
            : 
                <AiFillCaretDown {...dropDownProp} />
            }
            </DropDownButton>
        </Members>

        
    );
}