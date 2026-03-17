import { userVar } from "@/apollo/store";
import { getRoleRoute } from "@/libs/utils/getRoleRoute";
import { useReactiveVar } from "@apollo/client/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../Footer";
import HorizontalLine from "../HorizontalLine";
import Logo from "../Logo";
import Navigation from "./Navigation";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useReactiveVar(userVar);
  const homeRoute = getRoleRoute(user.memberType);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-col h-auto px-3 bg-[#1A8057] pt-[40px] pb-5">
          <View className="flex flex-row w-full justify-between mt-8 items-center px-2">
            <Pressable onPress={() => router.push(homeRoute as any)}>
              <Logo />
            </Pressable>
            <View className="flex flex-row items-center gap-3">
              <Pressable onPress={() => router.push("/(root)/profile")}>
                <FontAwesome name="user-circle-o" size={20} color="white" />
              </Pressable>

              <View className="h-6 w-[2px] bg-white" />

              <Pressable
                onPress={() => router.push("/(root)/favoriteProducts")}
              >
                <FontAwesome6 name="heart" size={20} color="white" />
              </Pressable>

              <View className="h-6 w-[2px] bg-white" />

              <Pressable>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>
          </View>
          <HorizontalLine />
          <View className="mt-5">
            <Navigation textColor="white" iconColor="white" />
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
