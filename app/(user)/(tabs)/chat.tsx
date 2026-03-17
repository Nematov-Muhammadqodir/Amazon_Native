import { userVar } from "@/apollo/store";
import UserCard from "@/components/UserCard";
import { useGetOrCreateRoom } from "@/hooks/useGetOrCreateRoom";
import { useSocket } from "@/hooks/useSocket";
import { useUsers } from "@/hooks/useUsers";
import { Member } from "@/types/member/member";
import { useReactiveVar } from "@apollo/client/react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const loggedInUser = useReactiveVar(userVar);
  const [active, setActive] = useState<"chats" | "groups">("chats");
  const { socket } = useSocket(loggedInUser._id);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const translateX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value, { duration: 350 }) }],
  }));

  const handlePress = (type: "chats" | "groups") => {
    setActive(type);
    translateX.value = type === "chats" ? 0 : 150;
  };

  const { getUsersData } = useUsers();
  const users = useMemo(() => {
    if (!getUsersData?.getAllUsers) return [];
    return getUsersData.getAllUsers.filter((user: Member) => user._id !== loggedInUser._id);
  }, [getUsersData, loggedInUser._id]);

  const { getOrCreateRoom } = useGetOrCreateRoom();

  const openChat = async (targetUserId: string) => {
    try {
      const res = await getOrCreateRoom({ variables: { input: { targetUserId } } });
      const roomId = res.data?.getOrCreateRoom._id;
      if (!roomId) return;
      router.push({
        pathname: "/chat/[roomId]",
        params: { roomId, isOnline: onlineUsers.includes(targetUserId) ? "true" : "false" },
      });
    } catch (err) {
      console.log("CHAT ERROR:", err);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (users: string[]) => setOnlineUsers(users);
    socket.on("onlineUsers", handleOnlineUsers);
    socket.emit("getOnlineUsers");
    return () => { socket.off("onlineUsers", handleOnlineUsers); };
  }, [socket]);

  return (
    <SafeAreaView className="flex-1 bg-[#BCD38B]">
      <View className="w-full items-center mt-6">
        <View
          className="w-[90%] bg-[#D3D9B1] p-2 rounded-2xl flex-row relative"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}
        >
          <Animated.View style={animatedStyle} className="absolute bg-white h-full w-1/2 rounded-xl mt-2 mx-5" />
          <Pressable onPress={() => handlePress("chats")} className="flex-1 py-3 items-center">
            <Text className="font-semibold text-black">Chats</Text>
          </Pressable>
          <Pressable onPress={() => handlePress("groups")} className="flex-1 py-3 items-center">
            <Text className="font-semibold text-black">Groups</Text>
          </Pressable>
        </View>
      </View>
      {active === "chats" ? (
        <ScrollView className="mt-5 px-5 gap-2 mb-[60px]">
          {users?.map((user: Member) => (
            <Pressable key={user._id} onPress={() => openChat(user._id)}>
              <UserCard user={user} isOnline={onlineUsers.includes(user._id)} />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <ScrollView className="mt-5 px-5 mb-[60px]" contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View className="flex flex-row justify-center items-center gap-2">
            <Text className="text-[20px] font-JakartaBold">No Group Chats Yet</Text>
            <Ionicons name="people-circle-outline" size={34} color="black" />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
