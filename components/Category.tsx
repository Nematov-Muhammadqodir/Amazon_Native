import { images } from "@/constants";
import { ProductCollection } from "@/libs/enums/product.enum";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CategoryInterface {
  category: ProductCollection;
  image: any;
}

export default function Category({
  handleSearchByCollection,
}: {
  handleSearchByCollection?: (collection: ProductCollection) => void;
}) {
  const categories: CategoryInterface[] = [
    { category: ProductCollection.ALL, image: images.all_products },
    { category: ProductCollection.FRUITS, image: images.fruits },
    { category: ProductCollection.MASHROOMS, image: images.mushroom },
    { category: ProductCollection.MEAT_EGGS, image: images.meat },
    { category: ProductCollection.MILK_BEVARAGES, image: images.milk },
    { category: ProductCollection.NUTS, image: images.nuts },
    { category: ProductCollection.VEGETABLES, image: images.vegetables },
    { category: ProductCollection.GREENS, image: images.greens },
  ];
  return (
    <View className="flex justify-center items-center mt-10">
      <Text className="text-[20px] font-JakartaExtraBold">Category</Text>
      <View className="flex flex-row flex-wrap gap-3 justify-between mt-3 w-[100%]">
        {categories.map((category: CategoryInterface, index) => (
          <TouchableOpacity
            className="p-3 bg-[#E9EEEA] rounded-xl"
            key={index}
            onPress={() => {
              if (category.category === ProductCollection.ALL) {
                router.push("/products");
              } else {
                router.push({
                  pathname: "/products",
                  params: { collection: category.category },
                });
              }
            }}
          >
            <Image source={category.image} className="w-[45px] h-[45px]" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
