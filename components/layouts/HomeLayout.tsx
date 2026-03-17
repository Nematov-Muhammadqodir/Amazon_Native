import { userVar } from "@/apollo/store";
import { logOut } from "@/libs/auth";
import { getRoleRoute } from "@/libs/utils/getRoleRoute";
import { useReactiveVar } from "@apollo/client/react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../Footer";
import Logo from "../Logo";
import MenuDropdown from "../MenuDropdown";
import SearchInput from "../SearchInput";
import Navigation from "./Navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useReactiveVar(userVar);
  const homeRoute = getRoleRoute(user.memberType);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-col h-auto px-0">
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
          <View className="flex flex-row w-full justify-between mt-8 items-center px-4">
            <Pressable onPress={() => router.push(homeRoute as any)}>
              <Logo />
            </Pressable>
            <MenuDropdown
              triggerSize={28}
              triggerColor="black"
              options={[
                {
                  text: "My Page",
                  onSelect: () => router.push("/(root)/profile"),
                },
                { text: "Logout", onSelect: () => logOut() },
                { text: "Users", onSelect: () => router.push("/(root)/users") },
              ]}
            />
          </View>
          <View className="mt-5 px-3">
            <SearchInput />
          </View>
          <View className="mt-5">
            <Navigation />
          </View>
        </View>
        <View className="flex-1">
          <View className="px-0">{children}</View>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
