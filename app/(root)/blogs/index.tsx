import BlogsCart from "@/components/BlogsCart";
import BlogsLayout from "@/components/layouts/BlogsLayout";
import { useBoardArticles } from "@/hooks/useBoardArticles";
import { extractTextFromHTML } from "@/types/config";
import React, { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Host, Portal } from "react-native-portalize";

export default function Blogs() {
  const { boardArticlesData } = useBoardArticles({
    page: 1,
    limit: 10,
    sort: "createdAt",
    direction: "ASC",
    search: {},
  });

  const boardArticles = boardArticlesData?.getBoardArticles.list;

  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const modalizeRef = useRef<Modalize>(null);

  const openBottomSheet = (article: any) => {
    setSelectedArticle(article);
    modalizeRef.current?.open();
  };

  return (
    <Host>
      <BlogsLayout>
        <View className="mt-5 px-[25px]">
          <Text className="text-[20px] font-JakartaExtraBold">
            Latest News and Blogs
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 20,
          }}
        >
          {boardArticles?.map((boardArticle) => (
            <View
              key={boardArticle._id}
              style={{ width: 171, height: 227 }}
              className="border-2 rounded-lg p-[10px] border-gray-300"
            >
              <BlogsCart
                boardArticle={boardArticle}
                onPress={() => openBottomSheet(boardArticle)}
              />
            </View>
          ))}
        </ScrollView>
      </BlogsLayout>

      <Portal>
        <Modalize ref={modalizeRef} adjustToContentHeight snapPoint={400}>
          <View className="p-5 h-[400px]">
            <ScrollView>
              <Text className="text-[14px] font-JakartaLight">
                {selectedArticle
                  ? extractTextFromHTML(selectedArticle.articleContent)
                  : ""}
              </Text>
            </ScrollView>
          </View>
        </Modalize>
      </Portal>
    </Host>
  );
}