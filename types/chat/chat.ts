import { Member } from "../member/member";

export interface ChatRoomType {
  _id: string;
  participants: Member[];
  lastMessage?: string;
  createdAt: Date;
}
