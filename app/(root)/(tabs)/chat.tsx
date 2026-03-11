import UserCard from "@/components/UserCard";
import { useUsers } from "@/hooks/useUsers";
import { Member } from "@/types/member/member";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const [active, setActive] = useState<"chats" | "groups">("chats");

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value, { duration: 350 }) },
    ],
  }));

  const handlePress = (type: "chats" | "groups") => {
    setActive(type);
    translateX.value = type === "chats" ? 0 : 150; // move slider
  };

  const { getUsersLoading, getUsersData } = useUsers();
  const users = getUsersData?.getAllUsers;
  console.log("users", users);
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 bg-[#BCD38B]">
      <View className="w-full items-center mt-6">
        <View
          className="w-[90%] bg-[#D3D9B1] p-2 rounded-2xl flex-row relative"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {/* Sliding Background */}
          <Animated.View
            style={animatedStyle}
            className="absolute bg-white h-full w-1/2 rounded-xl mt-2 mx-5"
          />

          {/* Chats */}
          <Pressable
            onPress={() => handlePress("chats")}
            className="flex-1 py-3 items-center"
          >
            <Text className="font-semibold text-black">Chats</Text>
          </Pressable>

          {/* Groups */}
          <Pressable
            onPress={() => handlePress("groups")}
            className="flex-1 py-3 items-center"
          >
            <Text className="font-semibold text-black">Groups</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView className="mt-5 px-5 gap-2 mb-[60px]">
        {users?.map((user: Member) => (
          <Pressable
            key={user._id}
            onPress={() =>
              router.push(
                `/chat/${{
                  pathname: "/chat/[userId]",
                  params: { userId: user._id },
                }}`
              )
            }
          >
            <UserCard user={user} />
            <UserCard user={user} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
