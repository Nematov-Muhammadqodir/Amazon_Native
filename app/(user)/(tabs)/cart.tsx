import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import Footer from "@/components/Footer";
import HorizontalLine from "@/components/HorizontalLine";
import ShoppingCartCard from "@/components/ShoppingCartCard";
import { images } from "@/constants";
import { deleteAll } from "@/slice/cartSlice";
import { RootState } from "@/store";
import { sweetMixinSuccessAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
  const user = useReactiveVar(userVar);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const totalAmount = cartItems.reduce((total, item) => {
    const discountedPrice = item.price - (item.price * item.discountRate) / 100;
    return total + discountedPrice * item.quantity;
  }, 0);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_GRAPHQL_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation { createPaymentIntent(amount: ${totalAmount}) }`,
        }),
      }
    );
    const { data } = await response.json();
    return data.createPaymentIntent;
  };

  const initializePaymentSheet = async () => {
    const clientSecret = await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      merchantDisplayName: "ShijangMe",
      paymentIntentClientSecret: clientSecret,
    });
    if (!error) openPaymentSheet();
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      alert(`Payment failed: ${error.message}`);
    } else {
      sweetMixinSuccessAlert(`${user.memberNick}, thank you for your purchase!`);
      dispatch(deleteAll());
      router.back();
    }
  };

  return (
    <SafeAreaView className="bg-gray-100" edges={["top", "left", "right"]}>
      <ScrollView>
        <View>
          <Pressable onPress={() => router.back()}>
            <View className="flex flex-row items-center gap-2 px-5">
              <AntDesign name="arrow-left" size={24} color="black" />
              <Text className="text-[16px] font-JakartaBold">Continue Shopping</Text>
            </View>
          </Pressable>
          <HorizontalLine />
        </View>
        {cartItems.length !== 0 ? (
          <View>
            <View
              style={{
                marginTop: 35,
                marginBottom: 35,
                backgroundColor: "white",
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
                padding: 20,
                paddingBottom: 90,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: "#F3F3F5",
              }}
            >
              <View className="flex flex-row gap-2 items-center mb-2">
                <Feather name="shopping-bag" size={24} color="black" />
                <Text className="font-JakartaMedium text-[18px]">
                  Shopping Cart ({cartItems.length} items)
                </Text>
              </View>
              <View className="mt-0">
                {cartItems.map((item) => (
                  <ShoppingCartCard key={item._id} cartItem={item} />
                ))}
              </View>
              <CustomButton
                title="Proceed to Checkout"
                className="rounded-lg bg-black gap-2 mt-7"
                IconLeft={<Feather name="credit-card" size={24} color="white" />}
                onPress={initializePaymentSheet}
              />
            </View>
            <Footer />
          </View>
        ) : (
          <View style={{ flex: 1, marginTop: 35, marginBottom: 35 }} className="justify-center items-center">
            <Image source={images.noResult} className="w-[200px] h-[200px]" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
