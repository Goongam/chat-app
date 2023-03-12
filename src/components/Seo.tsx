import Head from "next/head";

interface titleProps {
    title: string
}

export default function Seo({title}: titleProps){
    return <Head>
        <title>{`${title}`}</title>
    </Head>
}