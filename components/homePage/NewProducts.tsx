import { useNewProducts } from "@/hooks/useNewProducts";
import { Products } from "@/types/product/product";
import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import Swiper from "react-native-swiper";
import NewProductCard from "./NewProduct";

interface GetProductsResponse {
  getProducts: Products;
}

export default function NewProducts() {
  const { products, loading } = useNewProducts();

  const swiper = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="items-center mt-10">
      <Text className="text-[20px] font-JakartaExtraBold">New Products</Text>

      <Swiper
        style={{
          height: 380,
          justifyContent: "center",
          alignItems: "center",
        }}
        loop={false}
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
