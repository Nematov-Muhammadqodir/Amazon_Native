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
import { SafeAreaView } from "react-native-safe-area-context";

export default function VendorChat() {
  const loggedInUser = useReactiveVar(userVar);
  const { socket } = useSocket(loggedInUser._id);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { getUsersData } = useUsers();
  const users = useMemo(() => {
    if (!getUsersData?.getAllUsers) return [];
    return getUsersData.getAllUsers.filter(
      (user: Member) => user._id !== loggedInUser._id
    );
  }, [getUsersData, loggedInUser._id]);

  const { getOrCreateRoom } = useGetOrCreateRoom();

  const openChat = async (targetUserId: string) => {
    try {
      const res = await getOrCreateRoom({
        variables: { input: { targetUserId } },
      });
      const roomId = res.data?.getOrCreateRoom._id;
      if (!roomId) return;
      router.push({
        pathname: "/chat/[roomId]",
        params: {
          roomId,
          isOnline: onlineUsers.includes(targetUserId) ? "true" : "false",
        },
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
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket]);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F0E1]">
      <View className="px-5 pt-6 pb-3">
        <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
          Messages
        </Text>
      </View>
      <ScrollView className="px-5 mb-[90px]">
        {users?.map((user: Member) => (
          <Pressable key={user._id} onPress={() => openChat(user._id)}>
            <UserCard
              user={user}
              isOnline={onlineUsers.includes(user._id)}
            />
          </Pressable>
        ))}
        {users.length === 0 && (
          <View className="items-center mt-20">
            <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
            <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
              No conversations yet
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
