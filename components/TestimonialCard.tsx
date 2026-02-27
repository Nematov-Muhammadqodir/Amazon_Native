import { images } from "@/constants";
import { Comment } from "@/types/comment/comment";
import { REACT_APP_API_URL } from "@/types/config";
import React from "react";
import { Image, Text, View } from "react-native";
import RatingStars from "./RatingStars";

export default function TestimonialCard({ comment }: { comment: Comment }) {
  const memberImage = `${REACT_APP_API_URL}/${comment?.memberData?.memberImage}`;
  return (
    <View
      className="rounded-xl py-[23px] px-[30px] gap-3 bg-[#1A8057] w-[335px]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.55,
        shadowRadius: 6,
        elevation: 6,
      }}
    >
      <RatingStars rating={4} />
      <Text className="text-white font-JakartaLight h-auto max-h-[70px] flex overflow-hidden">
        {comment.commentContent}
      </Text>

      <View className="flex flex-row gap-3">
        {memberImage ? (
          <Image
            source={{ uri: memberImage }}
            className="w-[50px] h-[50px] rounded-full items-center justify-center bg-white"
          />
        ) : (
          <Image
            source={images.meat}
            className="w-[50px] h-[50px] rounded-full items-center justify-center bg-white"
          />
        )}
        <View className="flex justify-center">
          <Text className="text-white font-JakartaBold text-[16px]">
            {comment.memberData?.memberNick}
          </Text>
          <Text className="text-white font-JakartaMedium capitalize">
            {comment.memberData?.memberStatus}
          </Text>
        </View>
      </View>
    </View>
  );
}
