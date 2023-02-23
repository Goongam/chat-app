import { Room } from "@/pages";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useFetchRooms():{rooms:Room[], isLoading:boolean, isError: boolean, refetch:()=>void}{
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsloading] = useState(false);
    const [isError, setIsError] = useState(false);

    // if(isLoading){
    //     return {rooms, isLoading, isError};
    // }

    const call = ()=>{
        setIsloading(true);
        setIsError(false);

        fetch('/api/rooms')
            .then((res)=>res.json())
            .then(({rooms})=> setRooms(rooms))
            .catch(()=>{setIsError(true)})
            .then(()=>setIsloading(false));

    }

    const refetch = ()=>{
        call();
    }

    useEffect(()=>{
        call();
    },[]);

    return {rooms, isLoading, isError, refetch};
}