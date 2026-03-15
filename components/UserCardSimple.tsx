import { images } from "@/constants";
import { REACT_APP_API_URL } from "@/types/config";
import { Member } from "@/types/member/member";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface Props {
  user: Member;
}

export default function UserCardSimple({ user }: Props) {
  const imgPath = `${REACT_APP_API_URL}/${user.memberImage}`;

  return (
    <View className="flex flex-row justify-between items-center border-b-[1px] pb-2 border-gray-300">
      <View className="flex flex-row items-center  gap-3">
        {user.memberImage ? (
          <Image
            source={{ uri: imgPath }}
            className="w-[50px] h-[50px] rounded-full"
          />
        ) : (
          <Image
            source={images.defaultUser}
            className="w-[50px] h-[50px] rounded-full"
          />
        )}

        <Text className="text-[16px] font-JakartaBold">{user.memberNick}</Text>
      </View>
      <Pressable
        className="bg-blue-500 px-4 py-2 rounded-full"
        onPress={() => router.push(`/users/${user._id}`)}
      >
        <Text className="text-white font-JakartaSemiBold text-[12px]">
          View Profile
        </Text>
      </Pressable>
    </View>
  );
}
