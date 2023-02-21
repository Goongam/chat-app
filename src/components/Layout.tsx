import { ReactNode } from "react";
import styled from "styled-components";

type LayoutProps = { children? : ReactNode };

const Containter = styled.div`
    margin: 0 auto;
    text-align: center;
    border: 2px solid rgb(49, 194, 126);
    width: min(500px, 90vw);
    height: calc(100vh - 40px);
    border-radius: 1rem;
`;

export default function Layout({children}: LayoutProps){
    return (
        <Containter>
            <>
                {children}
            </>
        </Containter>
        
    )
}