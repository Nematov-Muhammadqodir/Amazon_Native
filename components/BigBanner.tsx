import { images } from "@/constants";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";

export default function BigBanner() {
  const screenWidth = Dimensions.get("window").width;
  return (
    <View
      style={{ width: screenWidth * 0.9 }}
      className="flex w-[345px] rounded-xl self-center h-[523px] relative bg-[#2E6646] mt-5"
    >
      <View className="flex absolute w-full h-auto top-[39px] items-center justify-center px-5">
        <Text className="text-white font-JakartaMedium">FARM-FRESH</Text>
        <Image source={images.bigBannerText} className="mt-3" />
        <Text className="color-white text-center font-JakartaExtraLight mt-3 capitalize">
          Fresh organic fruits and vegetables delivered daily for healthy
          eating.
        </Text>
      </View>
      <Image
        source={images.bannerImage}
        className="w-[300px] h-[400px] absolute bottom-0 self-center"
        resizeMode="cover"
      />
    </View>
  );
}
