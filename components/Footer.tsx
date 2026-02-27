import { logo } from "@/constants";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, Text, View } from "react-native";
import HorizontalLine from "./HorizontalLine";

export default function Footer() {
  return (
    <View className="bg-[#F1F1F1] px-5 py-12">
      {/* Logo */}
      <View className="items-center">
        <Image source={logo.group2} />
      </View>

      {/* Description */}
      <Text className="font-JakartaMedium mt-8 text-center text-gray-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
        aspernatur consequuntur fugiat nisi sint dignissimos reprehenderit saepe
        unde, hic totam?
      </Text>

      {/* Links Section */}
      <View className="flex flex-row justify-between gap-7 w-full mt-12">
        <View className="flex-1">
          <Text className="font-JakartaBold text-xl mb-4">Categories</Text>
          <View className="gap-2">
            <Text className="font-JakartaMedium">Immune Revival</Text>
            <Text className="font-JakartaMedium">Performance</Text>
            <Text className="font-JakartaMedium">Bundles</Text>
            <Text className="font-JakartaMedium">Shop All</Text>
          </View>
        </View>

        <View className="flex-1">
          <Text className="font-JakartaBold text-xl mb-4">Resources</Text>
          <View className="gap-2">
            <Text className="font-JakartaMedium">FAQ</Text>
            <Text className="font-JakartaMedium">Testimonials</Text>
            <Text className="font-JakartaMedium">Community</Text>
            <Text className="font-JakartaMedium">Statement</Text>
          </View>
        </View>

        <View className="flex-1">
          <Text className="font-JakartaBold text-xl mb-4">Useful Links</Text>
          <View className="gap-2">
            <Text className="font-JakartaMedium">Immune Revival</Text>
            <Text className="font-JakartaMedium">Performance</Text>
            <Text className="font-JakartaMedium">Bundles</Text>
            <Text className="font-JakartaMedium">Shop All</Text>
          </View>
        </View>
      </View>

      <View className="mt-10">
        <HorizontalLine />
      </View>

      {/* Address Section */}
      <View className="mt-10">
        <Text className="text-2xl font-JakartaExtraBold">Our Address</Text>

        <View className="mt-6 gap-5">
          <View className="flex flex-row gap-6">
            <View className="flex-1 flex flex-row gap-3 items-center">
              <EvilIcons name="location" size={24} color="black" />
              <Text className="text-sm text-gray-700">Busan, South Korea</Text>
            </View>

            <View className="flex-1 flex flex-row gap-3 items-center">
              <Ionicons name="call-outline" size={22} color="black" />
              <Text className="text-sm text-gray-700">010 8094-0023</Text>
            </View>
          </View>

          <View className="flex flex-row gap-6">
            <View className="flex-1 flex flex-row gap-3 items-center">
              <Fontisto name="email" size={18} color="black" />
              <Text numberOfLines={1} className="text-sm text-gray-700 flex-1">
                kevinbek0301@gmail.com
              </Text>
            </View>

            <View className="flex-1 flex flex-row gap-3 items-center">
              <FontAwesome5 name="globe" size={20} color="black" />
              <Text className="text-sm text-gray-700">www.yoursite.com</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
