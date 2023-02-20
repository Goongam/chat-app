import { Dispatch, SetStateAction, useEffect, useRef, ReactNode } from "react";
import styled, {keyframes} from "styled-components";

interface Props{
    setModalOpen : Dispatch<SetStateAction<boolean>>,
    children?: ReactNode,
}

const modalShow = keyframes`

  from {
    opacity: 0;
    margin-top: -50px;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }

`

const modalBgShow = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`

const ModalBody = styled.div`
    width: min(550px, 93vw);
    /* height: calc(fit-content + 10px); */
    background-color: white;

    animation: ${modalShow} 0.3s;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 5px 0 20px 0;

    border-radius: 1rem;
`

const Modal = styled.div`
  width: 100%;
  height: 100%;

  /* 최상단 위치 */
  z-index: 999;
  border: 1px solid black;
  background-color: #4e4b4b4a;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${modalBgShow} 0.3s;
`

const ExitButton = styled.button`
  width: 20px;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  margin-right: 5px;
  margin-left: auto;
`

export default function CreateRoomModal({setModalOpen, children}:Props){
    
    const modalRef = useRef(null);
    const modalBodyRef = useRef(null);

    useEffect(() => {
        // 이벤트 핸들러 함수
        const handler = (event: { target: any; }) => {

            if (modalRef.current && modalRef.current === event.target) {
                setModalOpen(false);
            }   
        };
        
        // 이벤트 핸들러 등록
        document.addEventListener('mousedown', handler);
        // document.addEventListener('touchstart', handler); // 모바일 대응
        
        return () => {
            // 이벤트 핸들러 해제
            document.removeEventListener('mousedown', handler);
            // document.removeEventListener('touchstart', handler); // 모바일 대응
        };
    },[setModalOpen]);

    return (

        <Modal ref={modalRef}>
           <ModalBody ref={modalBodyRef}>
            <ExitButton onClick={()=>{setModalOpen(false)}}>X</ExitButton>
                <div>
                {children}
                </div>
           </ModalBody>
        </Modal>

    );
}