import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type Host = string|undefined;
export type RoomIndex = string|string[]|undefined;
export interface InviteType{
  host: Host,
  roomIndex: RoomIndex,
}


export interface Chat{
  userName?: string,
  message: string,
  type: 'chat'|'notice',
  isMine?:boolean
}

export type Chats = Array<Chat>;

export interface UserName{
  userName:string|null,
  chatInit?:Chat[],
  chatType?: 'normal'|'random'|'ai',
}

// export interface Chatting{
//   name?:string,
//   message: string,
//   isMine:boolean,
// }