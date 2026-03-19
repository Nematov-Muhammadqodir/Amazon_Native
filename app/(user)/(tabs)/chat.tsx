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
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const loggedInUser = useReactiveVar(userVar);
  const { socket } = useSocket(loggedInUser._id);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const { getUsersData } = useUsers();
  const users = useMemo(() => {
    if (!getUsersData?.getAllUsers) return [];
    return getUsersData.getAllUsers.filter(
      (user: Member) => user._id !== loggedInUser._id
    );
  }, [getUsersData, loggedInUser._id]);

  const filtered = useMemo(() => {
    if (!search) return users;
    return users.filter((u: Member) =>
      u.memberNick?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

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
    <SafeAreaView className="flex-1 bg-white">
      {/* Telegram-style header */}
      <View className="px-5 pt-3 pb-2 border-b border-gray-100">
        <Text className="text-2xl font-JakartaExtraBold text-gray-900">
          Messages
        </Text>
      </View>

      {/* Telegram-style search */}
      <View className="px-5 py-2 bg-white">
        <View className="flex-row items-center bg-[#F0F1F5] rounded-xl px-3 py-2">
          <Ionicons name="search" size={18} color="#8E8E93" />
          <TextInput
            className="flex-1 ml-2 font-Jakarta text-[15px] text-gray-900"
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chat list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openChat(item._id)}
            className="px-4"
            android_ripple={{ color: "#f0f0f0" }}
          >
            <UserCard user={item} isOnline={onlineUsers.includes(item._id)} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
            <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
              No conversations yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
