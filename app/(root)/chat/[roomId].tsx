import { userVar } from "@/apollo/store";
import { GET_CHAT_ROOM, GET_MESSAGES } from "@/apollo/user/query";
import { images } from "@/constants";
import { getSocket } from "@/libs/socket";

import { ChatRoomType, GetMessages, MessageType } from "@/types/chat/chat";
import { REACT_APP_API_URL } from "@/types/config";
import { useQuery, useReactiveVar } from "@apollo/client/react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatRoomInterface {
  getChatRoom: ChatRoomType;
}

export default function Chat() {
  const loggedInUser = useReactiveVar(userVar);
  const { roomId, isOnline } = useLocalSearchParams();
  const isUserOnline = isOnline === "true";
  const socket = getSocket();
  const roomIdString = Array.isArray(roomId) ? roomId[0] : roomId;
  console.log("roomId", roomId);
  const {
    loading: getChatRoomLoading,
    data: getChatRoomData,
    error: getChatRoomError,
    refetch: getChatRoomRefetch,
  } = useQuery<ChatRoomInterface>(GET_CHAT_ROOM, {
    fetchPolicy: "cache-and-network",
    variables: { roomId: roomId },
    skip: !roomId,
  });
  const otherUser = getChatRoomData?.getChatRoom.participants.find(
    (participant) => participant._id !== loggedInUser?._id
  );

  const { data, refetch: getMessagesRefetch } = useQuery<GetMessages>(
    GET_MESSAGES,
    {
      variables: { roomId: roomIdString },
      skip: !roomIdString,
    }
  );

  const user = otherUser;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;

    socket?.emit("sendMessage", {
      chatRoomId: roomIdString,
      senderId: loggedInUser._id,
      text: message,
    });

    setMessage("");
  };

  useEffect(() => {
    if (data?.getMessages) {
      setMessages([...data.getMessages].reverse());
    }
  }, [data]);

  useEffect(() => {
    if (!roomIdString) return;

    // fetch messages from server again
    getMessagesRefetch?.();
  }, [roomIdString]);

  useEffect(() => {
    if (!roomId) return;
    console.log("Joining room:", roomId);
    socket?.emit("joinRoom", roomIdString);
  }, [roomId]);

  useEffect(() => {
    socket?.on("newMessage", (incomingMessage: MessageType) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === incomingMessage._id)) {
          return prev; // already added
        }
        return [incomingMessage, ...prev];
      });
    });
    return () => {
      socket?.off("newMessage");
    };
  }, []);
  const imgPath = `${REACT_APP_API_URL}/${user?.memberImage}`;
  return (
    <SafeAreaView className="flex-1 bg-[#BCD38B]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="justify-between h-full">
            <View className="flex flex-row justify-between px-5 items-center mt-2">
              <Pressable
                className="w-[50px] h-[50px] rounded-full items-center justify-center bg-[#D7E6B5] shadow-md"
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={30}
                  color="black"
                  className="pr-1"
                />
              </Pressable>
              <View className="items-center rounded-full px-5 py-1 bg-[#D7E6B5] shadow-md w-auto h-[50px] justify-center">
                <Text className="font-bold text-[14px] font-JakartaExtraBold">
                  {user?.memberNick}
                </Text>
                <Text className="font-JakartaMedium color-gray-700 text-[12px]">
                  {isUserOnline ? "Online" : "last seen recently"}
                </Text>
              </View>
              <View className="w-[50px] h-[50px] rounded-full items-center justify-center bg-[#D7E6B5] shadow-md">
                {user?.memberImage ? (
                  <Image
                    source={{ uri: imgPath }}
                    className="w-[48px] h-[48px] rounded-full"
                  />
                ) : (
                  <Image
                    source={images.defaultUser}
                    className="w-[48px] h-[48px] rounded-full"
                  />
                )}
              </View>
            </View>

            <View className="flex-1 px-4 mt-3">
              <FlatList
                data={messages}
                inverted
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View
                    className={`mb-2 max-w-[70%] px-4 py-2 rounded-2xl ${
                      item.senderId === loggedInUser._id
                        ? "self-end bg-[#D7E6B5] rounded-br-none"
                        : "self-start bg-white rounded-bl-none"
                    }`}
                  >
                    <Text>{item.text}</Text>
                  </View>
                )}
                initialNumToRender={15}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
              />
            </View>
            <View className="flex flex-row justify-between px-5 items-center mt-2 gap-3">
              <View className="w-[50px] h-[50px] rounded-full items-center justify-center bg-[#D7E6B5] shadow-md">
                <Ionicons name="attach" size={30} color="black" />
              </View>
              <View className="rounded-full px-5 bg-[#D7E6B5] shadow-md h-[50px] flex-1 justify-center">
                <TextInput
                  placeholder="Message"
                  className="w-full text-[14px]"
                  placeholderTextColor="#6b7280"
                  multiline
                  value={message}
                  onChangeText={setMessage}
                />
              </View>
              <View className="w-[50px] h-[50px] rounded-full items-center justify-center bg-[#D7E6B5] shadow-md">
                {message.trim().length > 0 ? (
                  <Pressable onPress={handleSendMessage}>
                    <Ionicons name="send" size={26} color="black" />
                  </Pressable>
                ) : (
                  <Pressable>
                    <Ionicons name="mic" size={30} color="black" />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
