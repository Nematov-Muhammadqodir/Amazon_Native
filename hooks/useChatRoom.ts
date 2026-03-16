import { GET_CHAT_ROOM, GET_MESSAGES } from "@/apollo/user/query";
import { ChatRoomType, GetMessages } from "@/types/chat/chat";
import { useQuery } from "@apollo/client/react";

interface ChatRoomInterface {
  getChatRoom: ChatRoomType;
}

export function useChatRoom(roomId?: string) {
  const {
    loading: getChatRoomLoading,
    data: getChatRoomData,
    error: getChatRoomError,
    refetch: getChatRoomRefetch,
  } = useQuery<ChatRoomInterface>(GET_CHAT_ROOM, {
    fetchPolicy: "cache-and-network",
    variables: { roomId },
    skip: !roomId,
  });

  const {
    data: getMessagesData,
    refetch: getMessagesRefetch,
  } = useQuery<GetMessages>(GET_MESSAGES, {
    variables: { roomId },
    skip: !roomId,
  });

  return {
    getChatRoomLoading,
    getChatRoomData,
    getChatRoomError,
    getChatRoomRefetch,
    getMessagesData,
    getMessagesRefetch,
  };
}