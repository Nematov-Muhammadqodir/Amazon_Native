import { Member } from "../member/member";

export interface ChatRoomType {
  _id: string;
  participants: Member[];
  lastMessage?: string;
  createdAt: Date;
}

export interface MessageType {
  _id: string;
  chatRoomId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface GetMessages {
  getMessages: MessageType[];
}
