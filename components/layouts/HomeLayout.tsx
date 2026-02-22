import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../Logo";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);
  return (
    <SafeAreaView className="flex-1 w-full bg-white flex-col">
      <View className="flex flex-col h-[215px] px-3 ">
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
          <Menu>
            <MenuTrigger>
              <AntDesign name="menu" size={24} color="black" />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: { padding: 5 } }}>
              <MenuOption
                customStyles={{
                  optionText: { fontFamily: "Jakarta-ExtraBold" },
                }}
                onSelect={() => router.replace("/(root)/(tabs)/profile")}
                text="My Page"
              />
              <MenuOption
                customStyles={{
                  optionText: { fontFamily: "Jakarta-ExtraBold" },
                }}
                onSelect={() => console.log("Logout")}
                text="Logout"
              />
            </MenuOptions>
          </Menu>
        </View>
      </View>

      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
