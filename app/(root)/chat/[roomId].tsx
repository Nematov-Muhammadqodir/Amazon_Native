import { userVar } from "@/apollo/store";
import { GET_CHAT_ROOM, GET_MESSAGES } from "@/apollo/user/query";
import { images } from "@/constants";
import { getToken } from "@/libs/auth";
import { getSocket } from "@/libs/socket";

import { ChatRoomType, GetMessages, MessageType } from "@/types/chat/chat";
import { REACT_APP_API_URL } from "@/types/config";
import { useQuery, useReactiveVar } from "@apollo/client/react";
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

interface MessageInput {
  text?: string;
  image?: string;
  type: "text" | "image";
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
  const [messageInput, setMessageInput] = useState<MessageInput>({
    text: "",
    image: "",
    type: "text",
  });

  const handleSendMessage = () => {
    console.log("messageInput", messageInput);
    if (!messageInput.text && !messageInput.image) return;

    socket?.emit("sendMessage", {
      chatRoomId: roomIdString,
      senderId: loggedInUser._id,
      text: messageInput.text,
      imageUrl: messageInput.image,
      type: messageInput.type,
    });

    setMessageInput({
      text: "",
      image: "",
      type: "text",
    });
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

  const uploadImage = async (image: any) => {
    console.log("Uploading image:", image);
    try {
      const token = await getToken();

      const formData = new FormData();

      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
            imageUploader(file: $file, target: $target)
          }`,
          variables: {
            file: null,
            target: "chat",
          },
        })
      );

      formData.append(
        "map",
        JSON.stringify({
          "0": ["variables.file"],
        })
      );

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

      const uploadedImage = response.data.data.imageUploader;

      setMessageInput((prev) => ({
        ...prev,
        image: uploadedImage,
      }));
    } catch (err) {
      console.log("Upload image error:", err);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      console.log("camera image", image);

      uploadImage(image);
    } catch (err) {
      console.log("Camera error:", err);
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      "Select Image",
      "Choose image source",
      [
        {
          text: "Camera",
          onPress: takePhoto,
        },
        {
          text: "Gallery",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert("Permission to access gallery is required!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"] as any,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      console.log("image", image);

      uploadImage(image);
    } catch (err) {
      console.log("Image picker error:", err);
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    return `${REACT_APP_API_URL}/${path}`;
  };
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
                renderItem={({ item }) => {
                  const isMe = item.senderId === loggedInUser._id;
                  console.log("messages", item);
                  return (
                    <View
                      className={`mb-3 max-w-[75%] ${
                        isMe ? "self-end" : "self-start"
                      }`}
                    >
                      <View
                        className={`rounded-2xl overflow-hidden ${
                          isMe
                            ? "bg-[#D7E6B5] rounded-br-none"
                            : "bg-white rounded-bl-none"
                        }`}
                        style={{
                          shadowColor: "#000",
                          shadowOpacity: 0.08,
                          shadowRadius: 4,
                          elevation: 2,
                        }}
                      >
                        {/* IMAGE MESSAGE */}
                        {item.imageUrl ? (
                          <Image
                            source={{
                              uri: getImageUrl(item.imageUrl),
                            }}
                            style={{
                              width: 220,
                              height: 220,
                              borderRadius: 14,
                            }}
                            resizeMode="cover"
                          />
                        ) : null}

                        {/* TEXT MESSAGE */}
                        {item.text ? (
                          <Text className="px-4 py-2 text-[14px] text-black">
                            {item.text}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  );
                }}
                initialNumToRender={15}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews
              />
            </View>
            <View className="flex flex-row justify-between px-5 items-center mt-2 gap-3">
              <View className="w-[50px] h-[50px] rounded-full items-center justify-center bg-[#D7E6B5] shadow-md">
                <Pressable onPress={selectImageSource}>
                  <Ionicons name="attach" size={30} color="black" />
                </Pressable>
              </View>
              <View className="rounded-full px-5 bg-[#D7E6B5] shadow-md h-[50px] flex-1 justify-center">
                <TextInput
                  placeholder="Message"
                  className="w-full text-[14px]"
                  placeholderTextColor="#6b7280"
                  multiline
                  value={messageInput.text}
                  onChangeText={(text) =>
                    setMessageInput((prev) => ({
                      ...prev,
                      text,
                      type: "text",
                    }))
                  }
                />
              </View>
              <View className="w-[50px] h-[50px] rounded-full items-center justify-center bg-[#D7E6B5] shadow-md">
                {messageInput.text?.trim().length || messageInput.image ? (
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
