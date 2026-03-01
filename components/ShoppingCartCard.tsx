import { images } from "@/constants";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function ShoppingCartCard() {
  return (
    <View className="mt-5 border-b-[0.5px] border-b-gray-300 pb-2">
      <View className="flex justify-between flex-row">
        <View className="flex flex-row gap-4">
          <View className="w-[108px] h-[108px] border-2 rounded-lg flex justify-center items-center border-[#F5F5F5]">
            <Image source={images.fruits} className="w-[88px] h-[88px]" />
          </View>
          <View className="flex justify-between">
            <Text className="text-[16px] font-JakartaBold">
              Mandarinni Pochagi
            </Text>
            <View className="flex flex-row items-center gap-2">
              <Pressable className="border-2 p-1 rounded-md border-[#F5F5F5] w-[40px] h-[40px] flex justify-center items-center">
                <FontAwesome6 name="plus" size={20} color="grey" />
              </Pressable>
              <View className="w-[40px] bg-[#F5F5F5] h-[30px] items-center justify-center rounded-md">
                <Text>2</Text>
              </View>
              <Pressable className="border-2 p-1 rounded-md border-[#F5F5F5] w-[40px] h-[40px] flex justify-center items-center">
                <FontAwesome6 name="minus" size={20} color="grey" />
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex justify-between items-center ">
          <Text className="text-[12px] font-JakartaBold">$85.00</Text>
          <Pressable className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="delete-variant"
              size={24}
              color="red"
            />
            <Text className="text-red-600">Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
