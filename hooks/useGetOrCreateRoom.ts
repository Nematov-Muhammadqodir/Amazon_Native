import { GET_OR_CREATE_ROOM } from "@/apollo/user/mutation";
import { Member } from "@/types/member/member";
import { useMutation } from "@apollo/client/react";

export interface GetOrCreateRoomResponse {
  getOrCreateRoom: {
    _id: string;
    participants: Member[];
    lastMessage?: string;
    createdAt: string;
  };
}

export function useGetOrCreateRoom() {
  const [getOrCreateRoom, { loading, error }] =
    useMutation<GetOrCreateRoomResponse>(GET_OR_CREATE_ROOM);

  return { getOrCreateRoom, getOrCreateRoomLoading: loading, getOrCreateRoomError: error };
}