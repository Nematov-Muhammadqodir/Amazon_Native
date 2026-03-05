import { Product } from "@/types/product/product";
import React from "react";
import { Text, View } from "react-native";
import AllProductsCard from "./AllProductsCard";

interface AllProductsProps {
  products?: Product[];
}

export default function AllProducts({ products }: AllProductsProps) {
  return (
    <View className=" flex justify-center mt-10">
      <Text className="text-[20px] font-JakartaExtraBold flex self-center">
        All Products
      </Text>
      <View className="flex flex-row flex-wrap mt-4 w-full justify-between">
        {products?.map((product) => (
          <View key={product._id} style={{ width: "49%" }}>
            <AllProductsCard item={product} />
          </View>
        ))}
      </View>
    </View>
  );
}
