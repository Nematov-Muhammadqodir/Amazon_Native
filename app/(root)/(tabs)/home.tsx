import AIChatRoom from "@/components/AIChatRoom";
import BigBanner from "@/components/BigBanner";
import Category from "@/components/Category";
import BoardArticlesList from "@/components/homePage/BoardArticlesList";
import NewProducts from "@/components/homePage/NewProducts";
import HomeLayout from "@/components/layouts/HomeLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

export default function home() {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <>
      <HomeLayout>
        <View className="mt-[45px]">
          <BigBanner />
          <Category />
          <NewProducts />
          <BoardArticlesList />
        </View>
      </HomeLayout>

      {/* Floating AI Chat Button */}
      <Pressable
        onPress={() => setChatVisible(true)}
        className="absolute bottom-28 right-5 w-14 h-14 rounded-full bg-[#2D4D23] items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="white" />
      </Pressable>

      {/* AI Chat Room Modal */}
      <AIChatRoom visible={chatVisible} onClose={() => setChatVisible(false)} />
    </>
  );
}
