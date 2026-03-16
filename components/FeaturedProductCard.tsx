import { userVar } from "@/apollo/store";
import { useProduct } from "@/hooks/useProduct";
import { useLikeProduct } from "@/hooks/useLikeProduct";
import { Message } from "@/libs/enums/common.enum";
import { addItem } from "@/slice/cartSlice";
import { T } from "@/types/common";
import { REACT_APP_API_URL } from "@/types/config";
import { Product } from "@/types/product/product";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Easing, Image, Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import RatingStars from "./RatingStars";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const user = useReactiveVar(userVar);
  const { likeTargetProduct } = useLikeProduct();

  const { getProductRefetch } = useProduct(product._id);

  const imgPath = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product.productImages[0]}`
    : "";

  const productDiscountedPrice =
    Number(product.productPrice) -
    (Number(product.productPrice) * product.productDiscountRate) / 100;

  /* -----------------------------
     FLY TO CART ANIMATION
  ------------------------------ */

  const flyAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showFlyIcon, setShowFlyIcon] = useState(false);

  const animateToCart = () => {
    setShowFlyIcon(true);

    flyAnim.setValue(0);
    opacityAnim.setValue(1);

    Animated.parallel([
      Animated.timing(flyAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFlyIcon(false);
    });
  };

  /* -----------------------------
     LIKE HANDLER
  ------------------------------ */

  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetProduct({ variables: { input: id } });

      await getProductRefetch({ input: id });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message);
    }
  };

  /* -----------------------------
     ADD TO CART HANDLER
  ------------------------------ */

  const addToCartHandler = () => {
    dispatch(
      addItem({
        _id: product._id,
        quantity: 1,
        price: Number(product.productPrice),
        name: product.productName,
        image: product.productImages[0],
        discountRate: product.productDiscountRate,
      })
    );

    animateToCart();
  };

  return (
    <View className="relative">
      <Pressable onPress={() => router.push(`/product/${product._id}`)}>
        <View className="flex flex-row p-3 gap-5 w-[335px] h-[124px] border-[0.5px] border-gray-400 rounded-lg items-center">
          {/* Image Section */}
          <View className="w-[98px] h-[110px] rounded-lg bg-[#F5F5F5] flex items-center justify-center relative">
            <Image source={{ uri: imgPath }} className="w-[90px] h-[90px]" />

            {/* Like Button */}
            <Pressable
              className="absolute top-2 left-2"
              onPress={() => likeProductHandler(user, product?._id)}
            >
              {product?.meLiked && product.meLiked[0]?.myFavorite ? (
                <Entypo name="heart" size={24} color="red" />
              ) : (
                <Entypo name="heart-outlined" size={24} color="black" />
              )}
            </Pressable>
          </View>

          {/* Info Section */}
          <View className="flex self-start">
            <Text className="font-JakartaMedium w-[240px]">
              {product.productDesc}
            </Text>

            <Text className="font-JakartaExtraBold w-[240px]">
              {product.productName}
            </Text>

            {/* Price */}
            <View className="flex flex-row gap-3 items-end">
              <Text className="text-xl font-JakartaExtraBold">
                ₩{" "}
                {product.productDiscountRate !== 0
                  ? productDiscountedPrice
                  : product.productPrice}
              </Text>

              {product.productDiscountRate !== 0 && (
                <Text className="text-xl text-gray-400 line-through font-JakartaExtraBold">
                  ₩ {product.productPrice}
                </Text>
              )}
            </View>

            <View className="flex flex-row justify-between relative">
              <RatingStars rating={4} />

              {/* ADD BUTTON */}
              <Pressable
                className="bg-[#1A8057] p-3 rounded-full absolute right-[15%] bottom-[-12px]"
                onPress={addToCartHandler}
              >
                <Entypo name="plus" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>

      {/* FLYING PLUS ICON */}
      {showFlyIcon && (
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 999,
            bottom: 10,
            right: 140,
            transform: [
              {
                translateX: flyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 150],
                }),
              },
              {
                translateY: flyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -300],
                }),
              },
              {
                scale: flyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.3],
                }),
              },
            ],
            opacity: opacityAnim,
          }}
        >
          <Entypo name="plus" size={168} color="#1A8057" />
        </Animated.View>
      )}
    </View>
  );
}
