import { useBoardArticles } from "@/hooks/useBoardArticles";
import { BoardArticle } from "@/types/board-article/board-article";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";
import CustomButton from "../CustomButton";
import BoardArticlesCard from "./BoardArticlesCard";

export default function BoardArticlesList() {
  const { width } = useWindowDimensions();
  const { boardArticlesData } = useBoardArticles({
    page: 1,
    limit: 5,
    sort: "createdAt",
    direction: "ASC",
    search: {},
  });

  const boardArticles = boardArticlesData?.getBoardArticles.list;
  console.log("boardArticles", boardArticles?.length);
  return (
    <View className="items-center mt-10 bg-[#F8FCEF] w-full py-[20px]">
      <Text className="text-[20px] font-JakartaExtraBold">
        Latest News and Blogs
      </Text>
      <View
        className="mt-5 flex justify-center items-center"
        style={{ width: width }}
      >
        {boardArticles?.map((boardArticle: BoardArticle) => (
          <View key={boardArticle._id} style={{ width: width * 0.8 }}>
            <BoardArticlesCard boardArticle={boardArticle} />
          </View>
        ))}
      </View>

      <View className="mt-5">
        <CustomButton
          title="View All Blogs"
          bgVariant="dark-yellow"
          className="h-[45px] gap-1"
          textStyle="text-[14px] font-Jakarta-Light text-black"
          IconRight={<AntDesign name="arrow-right" size={16} color="black" />}
          textVariant="primary"
          onPress={() => router.push("/(root)/blogs")}
        />
      </View>
    </View>
  );
}
