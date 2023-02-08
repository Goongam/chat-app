import { InviteType } from "@/pages/api/types/chat";
import { doCopy } from "@/util/doCopy";


export default function InviteBtn({host, roomIndex}:InviteType){
    const invite = () =>{
        const url = `${host}/invite/${roomIndex}`;
        doCopy(url);
    }
    return(
        <button onClick={invite}>초대url복사</button>
    );
}