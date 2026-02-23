import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import Swiper from "react-native-swiper";
import NewProductCard, { Product } from "./NewProduct";

const products: Product[] = [
  {
    id: "1",
    imageType: "image/png",
    imageData: "iVBORw0KGgoAAAANSUhEUgAAAAUA", // fake base64 sample
    productName: "Fresh Apples",
    productDescription: "Sweet and crispy organic apples",
    productPrice: "4500",
  },
  {
    id: "2",
    imageType: "image/png",
    imageData: "iVBORw0KGgoAAAANSUhEUgAAAAUB",
    productName: "Organic Milk",
    productDescription: "Pure farm fresh milk 1L",
    productPrice: "3200",
  },
  {
    id: "3",
    imageType: "image/png",
    imageData: "iVBORw0KGgoAAAANSUhEUgAAAAUC",
    productName: "Fresh Mushrooms",
    productDescription: "Natural white mushrooms pack",
    productPrice: "2800",
  },
  {
    id: "4",
    imageType: "image/png",
    imageData: "iVBORw0KGgoAAAANSUhEUgAAAAUD",
    productName: "Beef Steak",
    productDescription: "Premium Korean beef 300g",
    productPrice: "15900",
  },
  {
    id: "5",
    imageType: "image/png",
    imageData: "iVBORw0KGgoAAAANSUhEUgAAAAUE",
    productName: "Fresh Spinach",
    productDescription: "Healthy green spinach bundle",
    productPrice: "1900",
  },
];

export default function NewProducts() {
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
          width: "auto",
        }}
        ref={swiper}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {products.map((product: Product) => (
          <View
            key={product.id}
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
