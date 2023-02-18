import { Dispatch, SetStateAction, useState } from "react";


export default function useInput(initInput:string):[
    string,
    (e: React.ChangeEvent<HTMLInputElement>) => void,
]{
    const [inputValue, setInputValue] = useState(initInput);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return [inputValue, handleChange];
}