import { images } from "@/constants";
import { REACT_APP_API_URL } from "@/types/config";
import { Member } from "@/types/member/member";
import React from "react";
import { Image, Text, View } from "react-native";

interface Props {
  user: Member;
  isOnline?: boolean;
}

const getRoleBadge = (type: string) => {
  switch (type) {
    case "VENDOR":
      return { label: "Vendor", bg: "bg-purple-100", text: "text-purple-700" };
    case "ADMIN":
      return { label: "Admin", bg: "bg-red-100", text: "text-red-700" };
    default:
      return null;
  }
};

export default function UserCard({ user, isOnline }: Props) {
  const imgPath = `${REACT_APP_API_URL}/${user.memberImage}`;
  const badge = getRoleBadge(user.memberType);

  return (
    <View className="flex-row items-center py-3 px-1">
      {/* Avatar with online indicator */}
      <View className="relative">
        {user.memberImage ? (
          <Image
            source={{ uri: imgPath }}
            className="w-[52px] h-[52px] rounded-full"
          />
        ) : (
          <Image
            source={images.defaultUser}
            className="w-[52px] h-[52px] rounded-full"
          />
        )}
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full bg-[#4DCA5B] border-2 border-white" />
        )}
      </View>

      {/* Name + status */}
      <View className="flex-1 ml-3 border-b border-gray-100 pb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1">
            <Text
              className="text-[16px] font-JakartaBold text-gray-900"
              numberOfLines={1}
            >
              {user.memberNick}
            </Text>
            {badge && (
              <View className={`px-1.5 py-0.5 rounded ${badge.bg}`}>
                <Text className={`text-[9px] font-JakartaSemiBold ${badge.text}`}>
                  {badge.label}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-[11px] font-Jakarta text-gray-400">
            {isOnline ? "now" : ""}
          </Text>
        </View>
        <Text className="text-[13px] font-Jakarta text-gray-500 mt-0.5" numberOfLines={1}>
          {isOnline ? "Online" : "last seen recently"}
        </Text>
      </View>
    </View>
  );
}
