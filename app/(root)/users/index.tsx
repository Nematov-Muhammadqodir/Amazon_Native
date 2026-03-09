import HorizontalLine from "@/components/HorizontalLine";
import UserCard from "@/components/UserCard";
import { useUsers } from "@/hooks/useUsers";
import { Member } from "@/types/member/member";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Users() {
  const { getUsersLoading, getUsersData } = useUsers();
  const users = getUsersData?.getAllUsers;
  console.log("users", users);
  const { width, height } = useWindowDimensions();
  return (
    <SafeAreaView>
      <View className="mt-5 justify-center">
        <View className="relative flex justify-center items-center">
          <Text className="text-[20px] font-JakartaExtraBold flex self-center">
            All Users
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mb-5 self-start absolute left-2 top-1"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
        </View>
        <HorizontalLine />
        <View
          className="self-center mt-5 h-[40px]"
          style={{ width: width * 0.9 }}
        >
          <TextInput
            className={`rounded-xl bg-gray-300 p-2 pl-11 font-JakartaSemiBold text-[15px] flex-1  text-left h-[40px]`}
          />
          <Feather
            name="search"
            size={24}
            color="black"
            className="absolute top-2 left-2"
          />
        </View>
        <HorizontalLine />

        <View className="mt-5 px-5 gap-2">
          {users?.map((user: Member) => (
            <Pressable
              key={user._id}
              onPress={() => router.push(`/users/${user._id}`)}
            >
              <UserCard user={user} />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
