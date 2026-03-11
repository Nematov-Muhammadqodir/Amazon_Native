import { images } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
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

export default function Chat() {
  const [messages, setMessages] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: String(i + 1),
      text: `This is message number ${i + 1} in the chat conversation.`,
      sender: i % 2 === 0 ? "me" : "other",
    }))
  );
  const [message, setMessage] = useState("");
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
                  UserName
                </Text>
                <Text className="font-JakartaMedium color-gray-700 text-[12px]">
                  last seen recently
                </Text>
              </View>
              <View className="w-[50px] h-[50px] rounded-full items-center justify-center bg-[#D7E6B5] shadow-md">
                <Image
                  source={images.defaultUser}
                  className="w-[48px] h-[48px] rounded-full"
                />
              </View>
            </View>

            <View className="flex-1 px-4 mt-3">
              <FlatList
                data={messages}
                inverted
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    className={`mb-2 max-w-[70%] px-4 py-2 rounded-2xl ${
                      item.sender === "me"
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
                  <Pressable>
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
