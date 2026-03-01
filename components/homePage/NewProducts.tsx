import { useNewProducts } from "@/hooks/useNewProducts";
import React, { useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Swiper from "react-native-swiper";
import NewProductCard from "./NewProduct";

export default function NewProducts() {
  const { width } = Dimensions.get("window");
  const { products, loading } = useNewProducts();

  const swiper = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="items-center mt-10">
      <Text className="text-[20px] font-JakartaExtraBold">New Products</Text>

      <Swiper
        ref={swiper}
        width={width}
        style={{
          height: 380,
          justifyContent: "center",
          alignItems: "center",
        }}
        loop={false}
        dot={
          <View className="w-[12px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[12px] h-[4px] mx-1  bg-[#0286FF] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {products.map((product) => (
          <View
            key={product._id}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NewProductCard item={product} />
          </View>
        ))}
      </Swiper>
    </View>
  );
}
