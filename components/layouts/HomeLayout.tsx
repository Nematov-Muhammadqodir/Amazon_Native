import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../Logo";
import MenuDropdown from "../MenuDropdown";
import Navigation from "../Navigation";
import SearchInput from "../SearchInput";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 w-full h-auto bg-white flex-col">
      <ScrollView>
        <View className="flex flex-col h-auto px-3 ">
          <View className="flex-row justify-between bg-[#2D4D23] h-[30px] w-full items-center px-2">
            <View className="flex flex-row justify-center items-center gap-1 w-1/2 ">
              <Ionicons name="flash" size={20} color="#E9AB18" />
              <Text className="text-white text-xs font-JakartaSemiBold">
                Flash Sale Limited Time Only
              </Text>
            </View>
            <Text className="text-white text-xs font-JakartaSemiBold">
              Free Shipping On All Orders
            </Text>
          </View>
          <View className="flex flex-row w-full justify-around mt-8 items-center">
            <Logo />
            <MenuDropdown
              triggerSize={28}
              triggerColor="black"
              options={[
                {
                  text: "My Page",
                  onSelect: () => router.replace("/(root)/(tabs)/profile"),
                },
                { text: "Logout", onSelect: () => console.log("Logout") },
              ]}
            />
          </View>
          <View className="mt-5">
            <SearchInput />
          </View>
          <View className="mt-5">
            <Navigation />
          </View>
        </View>
        <View className="flex-1 mb-[200px] px-7">{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
