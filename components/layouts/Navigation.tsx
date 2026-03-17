import { userVar } from "@/apollo/store";
import { getRoleRoute } from "@/libs/utils/getRoleRoute";
import { MemberType } from "@/libs/enums/member.enum";
import { useReactiveVar } from "@apollo/client/react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NavigationProps {
  textColor?: string;
  iconColor?: string;
}

export default function Navigation({
  textColor = "black",
  iconColor = "black",
}: NavigationProps) {
  const user = useReactiveVar(userVar);
  const homeRoute = getRoleRoute(user.memberType);

  return (
    <View className="flex flex-row justify-around items-center">
      <TouchableOpacity onPress={() => router.replace(homeRoute as any)}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(root)/aboutUs")}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          About Us
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(root)/blogs")}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          Blogs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(root)/cs")}>
        <Text style={{ color: textColor }} className="font-JakartaExtraBold">
          FAQ
        </Text>
      </TouchableOpacity>

      {user.memberType !== MemberType.ADMIN && (
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => router.push("/(user)/(tabs)/cart" as any)}
        >
          <Ionicons name="cart-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}
