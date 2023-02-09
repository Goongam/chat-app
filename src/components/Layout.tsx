import { ReactNode } from "react";
import styled from "styled-components";

type LayoutProps = { children? : ReactNode };

const Containter = styled.div`
    margin: 0 auto;
    text-align: center;
    border: 2px solid green;
    width: 500px;
    height: fit-content;
    border-radius: 1rem;
`;

export default function Layout({children}: LayoutProps){
    return (
        <Containter>
            <div>
                {children}
            </div>
        </Containter>
        
    )
}