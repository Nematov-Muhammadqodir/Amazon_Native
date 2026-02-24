import BigBanner from "@/components/BigBanner";
import Category from "@/components/Category";
import NewProducts from "@/components/homePage/NewProducts";
import HomeLayout from "@/components/layouts/HomeLayout";
import React from "react";
import { View } from "react-native";

export default function home() {
  return (
    <HomeLayout>
      <View className="px-5 mt-[45px]">
        <BigBanner />
        <Category />
        <NewProducts />
      </View>
    </HomeLayout>
  );
}
