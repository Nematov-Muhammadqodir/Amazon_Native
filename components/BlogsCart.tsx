import { images } from "@/constants";
import { REACT_APP_API_URL, extractTextFromHTML } from "@/types/config";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import RatingStars from "./RatingStars";

interface BlogsCartProps {
  boardArticle: any;
  onPress: () => void; // Pass from parent
}

export default function BlogsCart({ boardArticle, onPress }: BlogsCartProps) {
  const content = extractTextFromHTML(boardArticle.articleContent);

  const imgPath = `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`;

  return (
    <Pressable onPress={onPress} className="flex-1">
      <View className="flex flex-row justify-between items-center">
        <RatingStars rating={4} starSize={15} />
        {imgPath ? (
          <Image
            source={{ uri: imgPath }}
            className="w-[40px] h-[40px] rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Image
            source={images.defaultUser}
            className="w-[40px] h-[40px] rounded-full"
          />
        )}
      </View>

      {/* Article preview */}
      <View className="h-[98px] mt-2">
        <Text numberOfLines={5} className="text-[12px] font-JakartaLight">
          {content}
        </Text>
      </View>

      {/* Read More Button */}
      <TouchableOpacity onPress={onPress} className="mt-1">
        <Text className="text-[11px] text-[#1A8057] font-JakartaBold">
          Read more
        </Text>
      </TouchableOpacity>

      <View className="flex flex-row gap-2 mt-3 items-center overflow-hidden">
        <Text className="text-[10px] font-JakartaBold">
          -{boardArticle.memberData?.memberNick}
        </Text>
        <Text className="text-[10px] font-JakartaLight">
          {boardArticle.memberData?.memberAddress}
        </Text>
      </View>
    </Pressable>
  );
}
