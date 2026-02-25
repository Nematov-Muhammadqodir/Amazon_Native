import { images } from "@/constants";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CategoryInterface {
  category: string;
  image: any;
}

export default function Category() {
  const categories: CategoryInterface[] = [
    { category: "All", image: images.all_products },
    { category: "Fruits", image: images.fruits },
    { category: "Mushrooms", image: images.mushroom },
    { category: "Meat", image: images.meat },
    { category: "Milk", image: images.milk },
    { category: "Nuts", image: images.nuts },
    { category: "Vegetables", image: images.vegetables },
    { category: "Greens", image: images.greens },
  ];
  return (
    <View className="flex justify-center items-center mt-10">
      <Text className="text-[20px] font-JakartaExtraBold">Category</Text>
      <View className="flex flex-row flex-wrap gap-3 justify-between mt-3 w-[100%]">
        {categories.map((category: CategoryInterface, index) => (
          <TouchableOpacity className="p-3 bg-[#E9EEEA] rounded-xl" key={index}>
            <Image source={category.image} className="w-[45px] h-[45px]" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
