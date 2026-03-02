import { images } from "@/constants";
import { addItem, deleteItem, removeItem } from "@/slice/cartSlice";
import { CartItem } from "@/types/search";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function ShoppingCartCard({ cartItem }: { cartItem: CartItem }) {
  const dispatch = useDispatch();
  return (
    <View className="mt-5 border-b-[0.5px] border-b-gray-300 pb-2">
      <View className="flex justify-between flex-row">
        <View className="flex flex-row gap-4">
          <View className="w-[108px] h-[108px] border-2 rounded-lg flex justify-center items-center border-[#F5F5F5]">
            <Image source={images.fruits} className="w-[88px] h-[88px]" />
          </View>
          <View className="flex justify-between">
            <Text className="text-[16px] font-JakartaBold">
              {cartItem.name}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <Pressable
                className="border-2 p-1 rounded-md border-[#F5F5F5] w-[40px] h-[40px] flex justify-center items-center"
                onPress={() =>
                  dispatch(
                    addItem({
                      _id: cartItem._id,
                      quantity: 1,
                      price: Number(cartItem.price),
                      name: cartItem.name,
                      image: cartItem.image,
                      discountRate: cartItem.discountRate,
                    })
                  )
                }
              >
                <FontAwesome6 name="plus" size={20} color="grey" />
              </Pressable>
              <View className="w-[40px] bg-[#F5F5F5] h-[30px] items-center justify-center rounded-md">
                <Text>{cartItem.quantity}</Text>
              </View>
              <Pressable
                className="border-2 p-1 rounded-md border-[#F5F5F5] w-[40px] h-[40px] flex justify-center items-center"
                onPress={() =>
                  dispatch(
                    removeItem({
                      _id: cartItem._id,
                      quantity: 1,
                      price: Number(cartItem.price),
                      name: cartItem.name,
                      image: cartItem.image,
                      discountRate: cartItem.discountRate,
                    })
                  )
                }
              >
                <FontAwesome6 name="minus" size={20} color="grey" />
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex justify-between items-center ">
          <Text className="text-[12px] font-JakartaBold">
            ${cartItem.price}
          </Text>
          <Pressable
            className="flex flex-row items-center gap-2"
            onPress={() =>
              dispatch(
                deleteItem({
                  _id: cartItem._id,
                  quantity: 1,
                  price: Number(cartItem.price),
                  name: cartItem.name,
                  image: cartItem.image,
                  discountRate: cartItem.discountRate,
                })
              )
            }
          >
            <MaterialCommunityIcons
              name="delete-variant"
              size={24}
              color="red"
            />
            <Text className="text-red-600">Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
