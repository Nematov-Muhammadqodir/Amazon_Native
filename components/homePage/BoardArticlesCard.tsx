import { images } from "@/constants";
import { BoardArticle } from "@/types/board-article/board-article";
import {
  extractTextFromHTML,
  formatDate,
  REACT_APP_API_URL,
} from "@/types/config";
import React from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";

interface BoardArticlesCardInterface {
  boardArticle: BoardArticle;
}

export default function BoardArticlesCard({
  boardArticle,
}: BoardArticlesCardInterface) {
  console.log("boardArticle", boardArticle);
  const imgPath = `${REACT_APP_API_URL}/${boardArticle?.articleImage}`;
  const { width, height } = useWindowDimensions();
  return (
    <View className="flex flex-row">
      <View className="w-[130px] h-[128px] rounded-r-md">
        {imgPath ? (
          <Image
            className="w-full h-full rounded-xl"
            source={{ uri: imgPath }}
          />
        ) : (
          <Image className="w-full h-full rounded-xl" source={images.pomidor} />
        )}
      </View>
      <View className="flex-1 py-2 gap-1 border-l-0 px-2 rounded-r-xl">
        <View className="w-[100px] h-[23px] bg-[#1A8057] rounded-full flex justify-center items-center">
          <Text className="text-[10px] text-white">
            {formatDate(boardArticle.createdAt)}
          </Text>
        </View>
        <View className={`h-[60px] flex flex-nowrap pt-2`}>
          <Text className="text-[10px]">
            {extractTextFromHTML(boardArticle.articleContent)}
          </Text>
        </View>
        <View className="w-[100px] h-[23px]  rounded-full flex justify-center">
          <Text className="text-[10px]">{boardArticle.articleCategory}</Text>
        </View>
        <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-JakartaBold">
            {boardArticle.articleViews}{" "}
            {boardArticle.articleViews <= 1 ? "view" : "views"}
          </Text>
        </View>
      </View>
    </View>
  );
}
