import clientPromise from "./mongodb";
import * as mongoDB from "mongodb";

let client: mongoDB.MongoClient;
let db: mongoDB.Db;

export interface VerityData{
    roomid:string,
    inputpass: string,
}

export async function dbInit(){
    // client = await clientPromise;
    // db = client.db('chat');

    console.log('init');
}

export async function insertMsgDB(nickName:string|undefined, room:string, message:string) {
    const client = await clientPromise;
    const db = client.db('chat');

    const Test = await db.collection('messages').insertOne({
        "name": nickName,
        "roomIndex": room,
        "date": new Date(),
        "message":message,  
      });

    //   console.log(Test.insertedId.toHexString());

      
}

export async function createRoomDB(roomName:string, password?:string) {
    const client = await clientPromise;
    const db = client.db('chat');

    const rooms = await db.collection('rooms').insertOne({
        roomName,
        password,
    });
    
    return rooms.insertedId.toHexString();
}

export async function getRoomName(roomId:string) {
    const client = await clientPromise;
    const db = client.db('chat');

    const room = await db.collection("rooms").findOne({
        _id: new mongoDB.ObjectId(roomId),
    });

    return room?.roomName;
}

export async function getRoom(roomId: string) {
    const client = await clientPromise;
    const db = client.db('chat');

    const room = await db.collection("rooms").findOne({
        _id: new mongoDB.ObjectId(roomId),
    });

    return room;
}

export async function verifyRoom(data:VerityData) {
    const client = await clientPromise;
    const db = client.db('chat');

    const searchRoom = await db.collection('rooms').findOne({
        _id: new mongoDB.ObjectId(data.roomid),
    });

    return searchRoom?.password === data.inputpass
}
