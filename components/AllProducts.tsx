import { ProductFrom } from "@/libs/enums/product.enum";
import { Product } from "@/types/product/product";
import React from "react";
import { View } from "react-native";
import AllProductsCard from "./AllProductsCard";

interface AllProductsProps {
  products?: Product[];
  handleFiltering: (value: string) => void;
  handleFilteringByLocation: (location: ProductFrom) => void;
  selectedLocations?: string[];
}

export default function AllProducts({
  products,
  handleFiltering,
  handleFilteringByLocation,
  selectedLocations,
}: AllProductsProps) {
  const locations = Object.values(ProductFrom);
  return (
    <View className=" flex justify-center">
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
