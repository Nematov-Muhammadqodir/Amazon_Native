import { userVar } from "@/apollo/store";
import { GET_OR_CREATE_ROOM } from "@/apollo/user/mutation";
import UserCard from "@/components/UserCard";
import { useSocket } from "@/hooks/useSocket";
import { useUsers } from "@/hooks/useUsers";
import { Member } from "@/types/member/member";
import { useMutation, useReactiveVar } from "@apollo/client/react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface GetOrCreateRoomResponse {
  getOrCreateRoom: {
    _id: string;
    participants: Member[];
    lastMessage?: string;
    createdAt: string;
  };
}

export default function Chat() {
  const loggedInUser = useReactiveVar(userVar);
  const [active, setActive] = useState<"chats" | "groups">("chats");
  const { socket, isConnected } = useSocket(loggedInUser._id);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

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
  const users = getUsersData?.getAllUsers.filter(
    (user: Member) => user._id !== loggedInUser._id
  );

  const [getOrCreateRoom] =
    useMutation<GetOrCreateRoomResponse>(GET_OR_CREATE_ROOM);

  const openChat = async (targetUserId: string) => {
    console.log("targetUserId", targetUserId);

    try {
      const res = await getOrCreateRoom({
        variables: {
          input: { targetUserId },
        },
      });

      console.log("roomId", res);
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

    const handleOnlineUsers = (users: string[]) => {
      console.log("onlineUsers received:", users);
      setOnlineUsers(users);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    // ✅ Request current online users after subscribing
    // so we don't miss the event that fired on connection
    socket.emit("getOnlineUsers");

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    console.log("socket connected?", socket.connected);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
  }, []);

  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      console.log("onlineUsers", users);
      setOnlineUsers(users);
    };

    socket?.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket?.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

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
      {active === "chats" ? (
        <ScrollView className="mt-5 px-5 gap-2 mb-[60px]">
          {users?.map((user: Member) => (
            <Pressable key={user._id} onPress={() => openChat(user._id)}>
              <UserCard user={user} isOnline={onlineUsers.includes(user._id)} />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          className="mt-5 px-5 mb-[60px]"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="flex flex-row justify-center items-center gap-2">
            <Text className="text-[20px] font-JakartaBold">
              No Group Chats Yet
            </Text>
            <Ionicons name="people-circle-outline" size={34} color="black" />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
