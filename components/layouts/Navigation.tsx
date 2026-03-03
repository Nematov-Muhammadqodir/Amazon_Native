import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Navigation() {
  return (
    <View className="flex flex-row justify-around items-center">
      <TouchableOpacity onPress={() => router.replace("/(root)/(tabs)/home")}>
        <Text className="font-JakartaExtraBold">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text className="font-JakartaExtraBold">About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text className="font-JakartaExtraBold">Blogs</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text className="font-JakartaExtraBold">FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex justify-center items-center"
        onPress={() => router.push("/(root)/(tabs)/cart")}
      >
        <Ionicons name="cart-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
