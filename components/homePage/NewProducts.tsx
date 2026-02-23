import { GET_PRODUCTS } from "@/apollo/user/query";
import { Product, Products } from "@/types/product/product";
import { ProductsInquiry } from "@/types/product/product.input";
import { useQuery } from "@apollo/client/react";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Swiper from "react-native-swiper";
import NewProductCard from "./NewProduct";

interface GetProductsResponse {
  getProducts: Products;
}

export default function NewProducts() {
  const [input, setInput] = useState<ProductsInquiry>({
    page: 1,
    limit: 10,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  });
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const {
    loading: getNewProductsLoading,
    data: getNewProductsData,
    error: getNewProductsError,
    refetch: getNewProductsRefetch,
  } = useQuery<GetProductsResponse>(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: input,
    },
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    if (getNewProductsData?.getProducts) {
      console.log(
        "getNewProductsData",
        getNewProductsData?.getProducts.list.length
      );
      setNewProducts(getNewProductsData.getProducts.list);
      setTotalProducts(
        getNewProductsData.getProducts.metaCounter?.[0]?.total || 0
      );
    }
  }, [getNewProductsData]);
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
          <View className="w-[10px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {newProducts.map((product: Product) => (
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
