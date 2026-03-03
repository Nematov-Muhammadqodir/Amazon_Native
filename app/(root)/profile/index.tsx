import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { useReactiveVar } from "@apollo/client/react";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPage() {
  const user = useReactiveVar(userVar);
  console.log("user", user);
  return (
    <SafeAreaView>
      <View>
        <View className="bg-gray-100 p-4">
          {/* Container */}
          <View className="relative items-center">
            {/* Cover Image */}
            <Image
              source={images.backImage}
              className="w-full h-56 rounded-3xl"
              resizeMode="cover"
            />

            {/* Avatar Wrapper */}
            <View className="absolute -bottom-16 items-center">
              {/* White Outer Circle */}
              <View className="bg-white p-2 rounded-full">
                {/* Avatar */}
                <Image
                  source={images.defaultUser}
                  className="w-32 h-32 rounded-full"
                />

                {/* Edit Button */}
                <Pressable className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full">
                  <EvilIcons name="pencil" size={18} color="black" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Space below avatar */}
          <View className="h-20" />
        </View>
        <View className="flex justify-center items-center">
          <View className="flex flex-row justify-center items-center gap-1">
            <Text className="text-[20px] font-JakartaBold">Darrel Steward</Text>
            <MaterialIcons name="verified" size={24} color="#155FEF" />
          </View>
          <View className="flex flex-row items-center">
            <Text className="text-[16px] text-[#155FEF] font-JakartaSemiBold">
              Online
            </Text>
            <View className="w-[2px] h-4 bg-[#155FEF] mx-2" />
            <Text className="text-[16px] text-[#155FEF] font-JakartaSemiBold">
              {user.memberType}
            </Text>
          </View>
        </View>
        <View className="flex flex-row justify-center mt-5 gap-[16px]">
          <CustomButton
            title="Follow"
            className="rounded-xl px-5 gap-2"
            textStyle="font-JakartaSemiBold font-normal"
            IconLeft={<AntDesign name="user-add" size={24} color="white" />}
          />
          <CustomButton
            title="Message"
            IconLeft={<AntDesign name="message" size={24} color="black" />}
            className="rounded-xl px-5 gap-2 bg-[#F0F8FF]"
            textStyle="font-JakartaSemiBold font-normal"
            textVariant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
