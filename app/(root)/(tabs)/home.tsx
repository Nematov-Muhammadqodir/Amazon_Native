import BigBanner from "@/components/BigBanner";
import Category from "@/components/Category";
import BoardArticlesList from "@/components/homePage/BoardArticlesList";
import NewProducts from "@/components/homePage/NewProducts";
import HomeLayout from "@/components/layouts/HomeLayout";
import React from "react";
import { View } from "react-native";

export default function home() {
  return (
    <HomeLayout>
      <View className="mt-[45px]">
        <BigBanner />
        <Category />
        <NewProducts />
        <BoardArticlesList />
      </View>
    </HomeLayout>
  );
}
