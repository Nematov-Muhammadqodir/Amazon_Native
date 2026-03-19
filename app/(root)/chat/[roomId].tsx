import { userVar } from "@/apollo/store";
import { images } from "@/constants";
import { useChatRoom } from "@/hooks/useChatRoom";
import { getToken } from "@/libs/auth";
import { getSocket } from "@/libs/socket";

import { MessageType } from "@/types/chat/chat";
import { getImageUrl, REACT_APP_API_URL } from "@/types/config";
import { useReactiveVar } from "@apollo/client/react";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface MessageInput {
  text?: string;
  image?: string;
  type: "text" | "image";
}

export default function Chat() {
  const loggedInUser = useReactiveVar(userVar);
  const { roomId, isOnline } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isUserOnline = isOnline === "true";
  const socket = getSocket();
  const roomIdString = Array.isArray(roomId) ? roomId[0] : roomId;

  const { getChatRoomData, getMessagesData, getMessagesRefetch } =
    useChatRoom(roomIdString);

  const otherUser = getChatRoomData?.getChatRoom.participants.find(
    (participant) => participant._id !== loggedInUser?._id
  );

  const user = otherUser;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState<MessageInput>({
    text: "",
    image: "",
    type: "text",
  });

  const handleSendMessage = () => {
    if (!messageInput.text && !messageInput.image) return;
    socket?.emit("sendMessage", {
      chatRoomId: roomIdString,
      senderId: loggedInUser._id,
      text: messageInput.text,
      imageUrl: messageInput.image,
      type: messageInput.type,
    });
    setMessageInput({ text: "", image: "", type: "text" });
  };

  useEffect(() => {
    if (getMessagesData?.getMessages) {
      setMessages([...getMessagesData.getMessages].reverse());
    }
  }, [getMessagesData]);

  useEffect(() => {
    if (!roomIdString) return;
    getMessagesRefetch?.();
  }, [roomIdString]);

  useEffect(() => {
    if (!roomId) return;
    socket?.emit("joinRoom", roomIdString);
  }, [roomId]);

  useEffect(() => {
    socket?.on("newMessage", (incomingMessage: MessageType) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === incomingMessage._id)) return prev;
        return [incomingMessage, ...prev];
      });
    });
    return () => {
      socket?.off("newMessage");
    };
  }, []);

  const uploadImage = async (image: any) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) { imageUploader(file: $file, target: $target) }`,
          variables: { file: null, target: "chat" },
        })
      );
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", {
        uri: image.uri,
        name: image.fileName || "photo.jpg",
        type: image.mimeType || "image/jpeg",
      } as any);
      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_GRAPHQL_URL!,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            "apollo-require-preflight": "true",
          },
        }
      );
      setMessageInput((prev) => ({
        ...prev,
        image: response.data.data.imageUploader,
      }));
    } catch (err) {
      console.log("Upload image error:", err);
    }
  };

  const selectImageSource = () => {
    Alert.alert("Send Photo", "Choose source", [
      {
        text: "Camera",
        onPress: async () => {
          const p = await ImagePicker.requestCameraPermissionsAsync();
          if (!p.granted) return alert("Camera permission required!");
          const r = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          });
          if (!r.canceled) uploadImage(r.assets[0]);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!p.granted) return alert("Gallery permission required!");
          const r = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"] as any,
            allowsEditing: true,
            quality: 0.7,
          });
          if (!r.canceled) uploadImage(r.assets[0]);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const imgPath = user?.memberImage
    ? `${REACT_APP_API_URL}/${user.memberImage}`
    : null;

  return (
    <SafeAreaView className="flex-1 bg-[#EFEDDE]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {/* Telegram-style header */}
            <View className="flex-row items-center px-4 py-2 bg-white border-b border-gray-100">
              <Pressable onPress={() => router.back()} className="mr-3">
                <Ionicons name="arrow-back" size={24} color="#000" />
              </Pressable>

              {imgPath ? (
                <Image
                  source={{ uri: imgPath }}
                  className="w-[40px] h-[40px] rounded-full"
                />
              ) : (
                <Image
                  source={images.defaultUser}
                  className="w-[40px] h-[40px] rounded-full"
                />
              )}

              <View className="ml-3 flex-1">
                <Text className="font-JakartaBold text-[16px] text-gray-900">
                  {user?.memberNick}
                </Text>
                <Text
                  className={`text-[12px] font-Jakarta ${
                    isUserOnline ? "text-[#4DCA5B]" : "text-gray-400"
                  }`}
                >
                  {isUserOnline ? "online" : "last seen recently"}
                </Text>
              </View>

              <Pressable className="p-2">
                <Ionicons name="ellipsis-vertical" size={20} color="#000" />
              </Pressable>
            </View>

            {/* Telegram-style messages */}
            <FlatList
              data={messages}
              inverted
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8 }}
              renderItem={({ item, index }) => {
                const isMe = item.senderId === loggedInUser._id;
                const nextMsg = messages[index + 1];
                const showTail =
                  !nextMsg || nextMsg.senderId !== item.senderId;

                return (
                  <View
                    className={`mb-1 flex-row ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Time on left for my messages */}
                    {isMe && (
                      <Text className="text-[10px] text-gray-400 font-Jakarta self-end mb-1 mr-1">
                        {formatTime(item.createdAt)}
                      </Text>
                    )}

                    <View
                      style={{ maxWidth: "75%" }}
                      className={`rounded-2xl overflow-hidden ${
                        isMe
                          ? `bg-[#EFFDDE] ${showTail ? "rounded-tr-sm" : ""}`
                          : `bg-white ${showTail ? "rounded-tl-sm" : ""}`
                      }`}
                    >
                      {/* Image */}
                      {item.imageUrl ? (
                        <Pressable
                          onPress={() =>
                            setSelectedImage(getImageUrl(item.imageUrl))
                          }
                        >
                          <Image
                            source={{ uri: getImageUrl(item.imageUrl) }}
                            style={{ width: 240, height: 240 }}
                            className="rounded-2xl"
                            resizeMode="cover"
                          />
                        </Pressable>
                      ) : null}

                      {/* Text */}
                      {item.text ? (
                        <Text
                          className="px-3 py-2 text-[15px] text-gray-900"
                          style={{ fontFamily: "Jakarta" }}
                        >
                          {item.text}
                        </Text>
                      ) : null}
                    </View>

                    {/* Time on right for their messages */}
                    {!isMe && (
                      <Text className="text-[10px] text-gray-400 font-Jakarta self-end mb-1 ml-1">
                        {formatTime(item.createdAt)}
                      </Text>
                    )}
                  </View>
                );
              }}
              initialNumToRender={20}
              maxToRenderPerBatch={15}
              windowSize={10}
            />

            {/* Image preview bar */}
            {messageInput.image ? (
              <View className="px-4 py-2 bg-white border-t border-gray-100">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: getImageUrl(messageInput.image) }}
                    className="w-16 h-16 rounded-xl"
                    resizeMode="cover"
                  />
                  <Text className="flex-1 ml-3 font-Jakarta text-sm text-gray-500">
                    Photo attached
                  </Text>
                  <Pressable
                    onPress={() =>
                      setMessageInput((p) => ({ ...p, image: "" }))
                    }
                  >
                    <Ionicons name="close-circle" size={24} color="#999" />
                  </Pressable>
                </View>
              </View>
            ) : null}

            {/* Telegram-style input bar */}
            <View className="flex-row items-end px-3 py-2 bg-white border-t border-gray-100">
              <Pressable
                onPress={selectImageSource}
                className="w-[40px] h-[40px] rounded-full items-center justify-center"
              >
                <Ionicons name="attach" size={24} color="#8E8E93" />
              </Pressable>

              <View className="flex-1 mx-2 bg-[#F0F1F5] rounded-2xl px-4 py-2 max-h-[120px]">
                <TextInput
                  placeholder="Message"
                  className="text-[15px] text-gray-900"
                  style={{ fontFamily: "Jakarta" }}
                  placeholderTextColor="#8E8E93"
                  multiline
                  value={messageInput.text}
                  onChangeText={(text) =>
                    setMessageInput((prev) => ({ ...prev, text, type: "text" }))
                  }
                />
              </View>

              {messageInput.text?.trim() || messageInput.image ? (
                <Pressable
                  onPress={handleSendMessage}
                  className="w-[40px] h-[40px] rounded-full bg-[#2AABEE] items-center justify-center"
                >
                  <Ionicons name="send" size={18} color="white" />
                </Pressable>
              ) : (
                <Pressable className="w-[40px] h-[40px] rounded-full items-center justify-center">
                  <Ionicons name="mic" size={24} color="#8E8E93" />
                </Pressable>
              )}
            </View>

            {/* Fullscreen image modal */}
            <Modal visible={!!selectedImage} transparent animationType="fade">
              <View className="flex-1 bg-black justify-center items-center">
                <Pressable
                  onPress={() => setSelectedImage(null)}
                  style={{ position: "absolute", top: 60, right: 20, zIndex: 10 }}
                >
                  <Ionicons name="close" size={32} color="white" />
                </Pressable>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: "100%", height: "80%" }}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}