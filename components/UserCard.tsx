import { images } from "@/constants";
import { REACT_APP_API_URL } from "@/types/config";
import { Member } from "@/types/member/member";
import React from "react";
import { Image, Text, View } from "react-native";

export default function UserCard({
  user,
  isOnline,
}: {
  user: Member;
  isOnline?: boolean;
}) {
  const imgPath = `${REACT_APP_API_URL}/${user.memberImage}`;
  return (
    <View className="flex flex-row w-full items-center gap-3 border-b-[1px] pb-2 border-gray-300">
      <View className="">
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
      </View>
      <View>
        <Text className="text-[16px] font-JakartaBold">{user.memberNick}</Text>
        <Text className="text-[12px] color-gray-600">
          {isOnline ? "Online" : "Offline"}
        </Text>
      </View>
    </View>
  );
}
