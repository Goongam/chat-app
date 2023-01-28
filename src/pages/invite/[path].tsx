import { useRouter } from "next/router";

export default function Invite(){
    const router = useRouter()
    const { path } = router.query;



    if(!path) return <>잘못된 초대코드</>;

    router.push(`/chat?room=${path}`,'/');

}