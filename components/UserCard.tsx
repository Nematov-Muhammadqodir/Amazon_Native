import { images } from "@/constants";
import { REACT_APP_API_URL } from "@/types/config";
import { FollowInquiry } from "@/types/follow/follow.input";
import { Member } from "@/types/member/member";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

interface MemberFollowsProps {
  initialInput: FollowInquiry;
  subscribeHandler: any;
  unsubscribeHandler: any;
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

      <CustomButton
        title={isFollowing ? "Unfollow" : "Follow"}
        IconLeft={
          <Feather
            name={isFollowing ? "user-minus" : "user-plus"}
            size={20}
            color="#155FEF"
          />
        }
        className="rounded-xl px-5 gap-2 bg-[#F0F8FF]"
        textStyle="font-JakartaSemiBold font-normal"
        textVariant="primary"
        onPress={() => {
          if (isFollowing) {
            unsubscribeHandler(user._id);
          } else {
            subscribeHandler(user._id);
          }
        }}
      />
    </View>
  );
}
