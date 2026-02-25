import { REACT_APP_API_URL } from "@/types/config";
import { Product } from "@/types/product/product";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import RatingStars from "./RatingStars";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const imgPath = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : `${REACT_APP_API_URL}/${product?.productImages[0]}`;
  console.log("imgPath", imgPath);

  const productDiscountedPrice =
    Number(product.productPrice) -
    (Number(product.productPrice) * product.productDiscountRate) / 100;

  return (
    <Pressable>
      <View className="flex flex-row p-3 gap-5 w-[335px] h-[124px] border-[0.5px] border-gray-400 rounded-lg items-center">
        <View className="w-[98px] h-[110px] rounded-lg bg-[#F5F5F5] flex items-center justify-center">
          <Image source={{ uri: imgPath }} className="w-[90px] h-[90px]" />
        </View>
        <View className="flex self-start">
          <Text className="font-JakartaMedium flex overflow-hidden w-[240px]">
            {product.productDesc}
          </Text>
          <Text className="font-JakartaExtraBold flex overflow-hidden w-[240px]">
            {product.productName}
          </Text>

          <View className="flex flex-row gap-3 justify-start items-end">
            <Text className="text-xl flex overflow-hidden font-JakartaExtraBold">
              ₩{" "}
              {product.productDiscountRate !== 0
                ? productDiscountedPrice
                : product.productPrice}
            </Text>
            {product.productDiscountRate !== 0 && (
              <Text className="text-2xl text-gray-400 line-through flex overflow-hidden font-JakartaExtraBold">
                ₩ {product.productPrice}
              </Text>
            )}
          </View>
          <View className="flex flex-row justify-between relative">
            <RatingStars rating={4} />
            <Pressable className="bg-[#1A8057] p-3 rounded-full absolute right-[15%] bottom-[-12px]">
              <Entypo name="plus" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
