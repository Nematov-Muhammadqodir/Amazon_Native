import { GET_PRODUCT } from "@/apollo/user/query";
import HomeLayout from "@/components/layouts/HomeLayout";
import { images } from "@/constants";
import { REACT_APP_API_URL } from "@/types/config";
import { Product } from "@/types/product/product";
import { useQuery } from "@apollo/client/react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

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
    fetchPolicy: "cache-and-network",
    variables: { input: id },
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  const product = getProductData?.getProduct;
  const [activeImage, setActiveImage] = useState<string>("");
  console.log("activeImage", activeImage);

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

  const imgPath =
    product?.productImages.length !== 0
      ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
      : images.noResult;

  return (
    <HomeLayout>
      <View className="justify-center items-center mt-5">
        <Pressable
          onPress={() => router.back()}
          className="mb-5 self-start pl-7"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View>
          <View className="w-[335px] border-[1px] border-gray-400 bg-[#DAE9CB] rounded-[10px]">
            <Image
              source={{ uri: activeImage ? activeImage : imgPath }}
              className="self-center w-[155px] h-[195px]"
            />
          </View>
          {product.productImages.length < 2 && (
            <View className="flex flex-row flex-nowrap justify-between mt-4">
              {product.productImages.slice(0).map((image) => {
                const smallImagePath =
                  product?.productImages.length !== 0
                    ? `${REACT_APP_API_URL}/${image}`
                    : images.noResult;
                return (
                  <Pressable
                    className=" justify-start w-[75px] border-[1px] border-gray-400 rounded-[10px]"
                    key={image}
                    onPress={() =>
                      setActiveImage(`${REACT_APP_API_URL}/${image}`)
                    }
                  >
                    <Image
                      source={{ uri: smallImagePath }}
                      className="w-[65px] h-[75px] self-center"
                    />
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </HomeLayout>
  );
}
