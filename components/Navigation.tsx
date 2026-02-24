import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Navigation() {
  return (
    <View className="flex flex-row justify-around">
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
      <TouchableOpacity>
        <Text className="font-JakartaExtraBold">Track Order</Text>
      </TouchableOpacity>
    </View>
  );
}
