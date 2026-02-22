import { logo } from "@/constants"; // your logo object
import React from "react";
import { Image, View } from "react-native";

export default function Logo() {
  return (
    <View
      style={{ width: "70%" }}
      className="flex-row items-center justify-between"
    >
      <Image
        source={logo.group2}
        style={{ width: 190, height: 22 }}
        resizeMode="contain"
      />
    </View>
  );
}
