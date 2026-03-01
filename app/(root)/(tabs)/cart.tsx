import CustomButton from "@/components/CustomButton";
import Footer from "@/components/Footer";
import HorizontalLine from "@/components/HorizontalLine";
import ShoppingCartCard from "@/components/ShoppingCartCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function cart() {
  const cart = [1, 2, 3, 4];
  return (
    <SafeAreaView className=" bg-gray-100 " edges={["top", "left", "right"]}>
      <ScrollView>
        <View>
          <Pressable onPress={() => router.back()}>
            <View className="flex flex-row items-center gap-2 px-5">
              <AntDesign name="arrow-left" size={24} color="black" />
              <Text className="text-[16px] font-JakartaBold">
                Continue Shopping
              </Text>
            </View>
          </Pressable>
          <HorizontalLine />
        </View>
        <View
          style={{
            marginTop: 35,
            marginBottom: 35,
            backgroundColor: "white",
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            padding: 20,
            paddingBottom: 90,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "#F3F3F5",
          }}
        >
          <View className="flex flex-row gap-2 items-center">
            <Feather name="shopping-bag" size={24} color="black" />
            <Text className="font-JakartaMedium text-[18px]">
              Shopping Cart (3 items)
            </Text>
          </View>
          <View className="mt-5 ">
            {cart.map((item, index) => {
              return <ShoppingCartCard key={index} />;
            })}
          </View>
          <CustomButton
            title="Proceed to Checkout"
            className="rounded-lg bg-black gap-2 mt-7"
            IconLeft={<Feather name="credit-card" size={24} color="white" />}
          />
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
