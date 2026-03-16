import { images } from "@/constants";
import { REACT_APP_API_URL } from "@/types/config";
import { FollowInquiry } from "@/types/follow/follow.input";
import { Member } from "@/types/member/member";
import React from "react";
import { Image, Text, View } from "react-native";

interface MemberFollowsProps {
  initialInput?: FollowInquiry;
  subscribeHandler?: any;
  unsubscribeHandler?: any;
}

interface Props extends MemberFollowsProps {
  user: Member;
  isOnline?: boolean;
}

export default function UserCard({
  user,
  isOnline,
  subscribeHandler,
  unsubscribeHandler,
}: Props) {
  const imgPath = `${REACT_APP_API_URL}/${user.memberImage}`;
  const isFollowing = user.meFollowed?.[0]?.myFollowing ?? false;
  console.log("user", isFollowing);

  return (
    <View className="flex flex-row w-full items-center justify-between border-b-[1px] pb-2 border-gray-300">
      <View className="flex flex-row items-center gap-3">
        <View>
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
          <Text className="text-[16px] font-JakartaBold">
            {user.memberNick}
          </Text>
          <Text className="text-[12px] color-gray-600">
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <Text className="text-black font-JakartaSemiBold text-[12px]">
        {user.memberType}
      </Text>
    </View>
  );
}
