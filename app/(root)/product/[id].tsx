import { GET_PRODUCT } from "@/apollo/user/query";
import { images } from "@/constants";
import { Product } from "@/types/product/product";
import { useQuery } from "@apollo/client/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";

interface ProductDetailInterface {
  getProduct: Product;
}
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    loading: getProductLoading,
    data: getProductData,
    error: getProductError,
    refetch: getProductRefetch,
  } = useQuery<ProductDetailInterface>(GET_PRODUCT, {
    fetchPolicy: "network-only",
    variables: { input: id },
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  console.log("getProductData", getProductData?.getProduct);
  const product = getProductData?.getProduct;

  if (getProductLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0286FF" />
      </View>
    );
  if (getProductError)
    return Alert.alert(
      "Error",
      "Something went wrong!",
      [
        {
          onPress: () => router.push("/(root)/(tabs)/home"),
        },
      ],
      { cancelable: false }
    );
  if (!product)
    return (
      <View className="flex-1 justify-center items-center">
        <Image source={images.noResult} className="w-[300px] h-[300px]" />
        <Text className="font-JakartaExtraBold text-2xl">
          Oops sorry! No product found!
        </Text>
      </View>
    );

  return (
    <View>
      <Text>{product.productName}</Text>
      <Text>{product.productDesc}</Text>
      <Text>₩{product.productPrice}</Text>
    </View>
  );
}
