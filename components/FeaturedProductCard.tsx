import { userVar } from "@/apollo/store";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { useProduct } from "@/hooks/useProduct";
import { Message } from "@/libs/enums/common.enum";
import { T } from "@/types/common";
import { REACT_APP_API_URL } from "@/types/config";
import { Product } from "@/types/product/product";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/types/sweetAlert";
import { useMutation, useReactiveVar } from "@apollo/client/react";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import RatingStars from "./RatingStars";

interface FeaturedProductCardInterface {
  product: Product;
  refetch: () => void;
}

export default function FeaturedProductCard({ product }: { product: Product }) {
  const user = useReactiveVar(userVar);
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const imgPath = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : `${REACT_APP_API_URL}/${product?.productImages[0]}`;

  const {
    getProductLoading,
    getProductData,
    getProductError,
    getProductRefetch,
  } = useProduct(product._id);

  const productDiscountedPrice =
    Number(product.productPrice) -
    (Number(product.productPrice) * product.productDiscountRate) / 100;

  const likeProductHandler = async (user: T, id: string) => {
    console.log("likeRefid", user._id);
    console.log("user", user);
    console.log("id", id);
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetProduct({ variables: { input: id } });

      await getProductRefetch({
        input: id,
      });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("Error, likePropertyHandler", err);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  return (
    <Pressable>
      <View className="flex flex-row p-3 gap-5 w-[335px] h-[124px] border-[0.5px] border-gray-400 rounded-lg items-center">
        <View className="w-[98px] h-[110px] rounded-lg bg-[#F5F5F5] flex items-center justify-center relative">
          <Image source={{ uri: imgPath }} className="w-[90px] h-[90px]" />
          <Pressable
            className="absolute top-2 left-2"
            onPress={() => {
              console.log("user", user);
              console.log("product?._id", product?._id);
              likeProductHandler(user, product?._id);
            }}
          >
            {product?.meLiked && product.meLiked[0]?.myFavorite ? (
              <Entypo name="heart" size={24} color="red" />
            ) : (
              <Entypo name="heart-outlined" size={24} color="black" />
            )}
          </Pressable>
        </View>
        <View className="flex self-start">
          <Text className="font-JakartaMedium flex overflow-hidden w-[240px]">
            {product.productDesc}
          </Text>
          <Text className="font-JakartaExtraBold flex overflow-hidden w-[240px]">
            {product.productName}
          </Text>

          <View className="flex flex-row gap-3 justify-start items-end">
            <Text className="text-xl flex overflow-hidden font-JakartaExtraBold">
              ₩{" "}
              {product.productDiscountRate !== 0
                ? productDiscountedPrice
                : product.productPrice}
            </Text>
            {product.productDiscountRate !== 0 && (
              <Text className="text-2xl text-gray-400 line-through flex overflow-hidden font-JakartaExtraBold">
                ₩ {product.productPrice}
              </Text>
            )}
          </View>
          <View className="flex flex-row justify-between relative">
            <RatingStars rating={4} />
            <Pressable className="bg-[#1A8057] p-3 rounded-full absolute right-[15%] bottom-[-12px]">
              <Entypo name="plus" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
