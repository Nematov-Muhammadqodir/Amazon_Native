import HomeLayout from "@/components/layouts/HomeLayout";
import React from "react";
import { Text } from "react-native";

export default function home() {
  return (
    <HomeLayout>
      <Text className="color-red-800">home</Text>
    </HomeLayout>
  );
}
