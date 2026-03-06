import { ProductFrom } from "@/libs/enums/product.enum";
import { Product } from "@/types/product/product";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Text, View } from "react-native";
import AllProductsCard from "./AllProductsCard";
import MenuDropdown from "./MenuDropdown";

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
    <View className=" flex justify-center mt-10">
      <View className="flex flex-row justify-between">
        <MenuDropdown
          selected="Location"
          options={locations.map((location) => ({
            text: location,
            onSelect: () => handleFilteringByLocation(location),
            fontFamily: selectedLocations?.includes(location)
              ? "Jakarta-ExtraBold"
              : "Jakarta-Medium",
            selected: selectedLocations?.includes(location) ? true : false,
          }))}
          triggerIcon={<Entypo name="location" size={24} color="black" />}
        />
        <Text className="text-[20px] font-JakartaExtraBold flex self-center">
          All Products
        </Text>
        <MenuDropdown
          options={[
            {
              text: "Lowest Price",
              onSelect: () => handleFiltering("lowestPrice"),
            },
            {
              text: "Highest Price",
              onSelect: () => handleFiltering("highestPrice"),
            },
            {
              text: "Newest Products",
              onSelect: () => handleFiltering("new"),
            },
            {
              text: "Oldest Price",
              onSelect: () => handleFiltering("old"),
            },
            {
              text: "Highest Discount",
              onSelect: () => handleFiltering("highDiscount"),
            },
            {
              text: "Lowest Discount",
              onSelect: () => handleFiltering("lowDiscount"),
            },
          ]}
          triggerIcon={<AntDesign name="filter" size={24} color="black" />}
        />
      </View>
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
