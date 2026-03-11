import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type ChatCardProps = {
  userName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  isRead?: boolean;
};

export default function ChatCard({
  userName,
  avatar,
  lastMessage,
  time,
  unreadCount,
  isOnline,
  isRead,
}: ChatCardProps) {
  return (
    <Pressable className="flex-row items-center px-4 py-4 border-b border-gray-700">
      {/* Avatar */}
      <View className="relative">
        <Image source={{ uri: avatar }} className="w-14 h-14 rounded-full" />

        {isOnline && (
          <View className="absolute bottom-0 left-0 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0F1A24]" />
        )}
      </View>

      {/* Message Section */}
      <View className="flex-1 ml-4">
        <Text className="text-white text-lg font-semibold">{userName}</Text>

        <View className="flex-row items-center mt-1">
          {isRead && (
            <Ionicons
              name="checkmark-done"
              size={16}
              color="#4FC3F7"
              style={{ marginRight: 5 }}
            />
          )}

          <Text numberOfLines={1} className="text-gray-400 flex-1">
            {lastMessage}
          </Text>
        </View>
      </View>

      {/* Right Side */}
      <View className="items-end">
        <Text className="text-gray-400 text-sm">{time}</Text>

        {unreadCount && unreadCount > 0 && (
          <View className="bg-green-500 mt-2 px-2 py-1 rounded-full">
            <Text className="text-white text-xs">{unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
