import { Text, View } from "react-native";

export default function OurStories() {
  return (
    <View className="items-center px-6 mt-8">
      {/* small label */}
      <Text
        className="text-[12px] tracking-[3px] text-green-700 uppercase"
        style={{ fontFamily: "Jakarta-Medium" }}
      >
        Our Story
      </Text>

      {/* main heading */}
      <Text
        className="text-[28px] text-center mt-2 leading-9"
        style={{ fontFamily: "Jakarta-Bold" }}
      >
        Your Trusted Partner in{"\n"}Everyday Shopping
      </Text>

      {/* description */}
      <Text
        className="text-center text-gray-600 mt-4 text-[15px] leading-6 max-w-[320px]"
        style={{ fontFamily: "Jakarta" }}
      >
        Our journey started with a passion for fresh food, growing into an
        online store that delivers quality groceries straight to homes.
      </Text>
    </View>
  );
}
