import { GET_BOARD_ARTICLES } from "@/apollo/user/query";
import BlogsCart from "@/components/BlogsCart";
import { GetBlogsResponse } from "@/components/homePage/BoardArticlesList";
import BlogsLayout from "@/components/layouts/BlogsLayout";
import { extractTextFromHTML } from "@/types/config";
import { useQuery } from "@apollo/client/react";
import React, { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Host, Portal } from "react-native-portalize"; // 👈 add this

export default function Blogs() {
  const {
    loading: boardArticlesLoading,
    data: boardArticlesData,
    error: boardArticlesError,
  } = useQuery<GetBlogsResponse>(GET_BOARD_ARTICLES, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 10,
        sort: "createdAt",
        direction: "ASC",
        search: {},
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const boardArticles = boardArticlesData?.getBoardArticles.list;

  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const modalizeRef = useRef<Modalize>(null);

  const openBottomSheet = (article: any) => {
    setSelectedArticle(article);
    modalizeRef.current?.open();
  };

  return (
    // 👇 Wrap with Host so Portal can escape the ScrollView
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

      {/* 👇 Portal lifts Modalize to the top of the tree, above ScrollView & Footer */}
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
