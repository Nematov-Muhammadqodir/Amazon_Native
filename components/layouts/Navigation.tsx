import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NavigationProps {
  textColor?: string;
  iconColor?: string;
}

export default function Navigation({
  textColor = "black",
  iconColor = "black",
}: NavigationProps) {
  return (
    <View className="flex flex-row justify-around items-center">
      <TouchableOpacity onPress={() => router.replace("/(root)/(tabs)/home")}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(root)/aboutUs")}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          About Us
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(root)/blogs")}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          Blogs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(root)/cs")}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          FAQ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex justify-center items-center"
        onPress={() => router.push("/(root)/(tabs)/cart")}
      >
        <Ionicons name="cart-outline" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}
