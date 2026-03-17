import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import { useSocket } from "@/hooks/useSocket";
import { getToken, signUp } from "@/libs/auth";
import { MemberType } from "@/libs/enums/member.enum";
import { getRoleRoute } from "@/libs/utils/getRoleRoute";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Link, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MEMBER_TYPES = [
  {
    value: MemberType.USER,
    label: "Buyer",
    desc: "Browse and purchase products",
  },
  {
    value: MemberType.VENDOR,
    label: "Vendor",
    desc: "Sell your products",
  },
  {
    value: MemberType.ADMIN,
    label: "Admin",
    desc: "Manage the platform",
  },
];

export default function SignUp() {
  const user = useReactiveVar(userVar);
  const { socket } = useSocket(user?._id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token && user._id !== "") {
        router.replace(getRoleRoute(user.memberType) as any);
      }
    })();
  }, []);

  const [input, setInput] = useState({
    nick: "",
    password: "",
    phone: "",
    type: "USER",
    adminCode: "",
  });

  const handleInput = useCallback((name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const doSignUp = useCallback(async () => {
    if (!input.nick || !input.password || !input.phone) {
      await sweetErrorAlert("Please fill in all fields");
      return;
    }
    if (input.nick.length < 3 || input.nick.length > 12) {
      await sweetErrorAlert("Nickname must be 3-12 characters");
      return;
    }
    if (input.password.length < 5 || input.password.length > 12) {
      await sweetErrorAlert("Password must be 5-12 characters");
      return;
    }

    if (input.type === MemberType.ADMIN) {
      const secret = process.env.EXPO_PUBLIC_ADMIN_SECRET;
      if (!secret || input.adminCode !== secret) {
        await sweetErrorAlert("Invalid admin secret code");
        return;
      }
    }

    setLoading(true);
    try {
      const userData = await signUp(
        input.nick,
        input.password,
        input.phone,
        input.type
      );
      router.replace(getRoleRoute(userData.memberType) as any);
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }, [input]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="px-6 pt-10 pb-6">
          <Text className="text-3xl font-JakartaExtraBold text-[#2D4D23]">
            Create Account
          </Text>
          <Text className="text-base font-Jakarta text-gray-500 mt-2">
            Sign up to get started
          </Text>
        </View>

        {/* Form */}
        <View className="px-6">
          <InputField
            label="Nickname"
            placeholder="Enter your nickname"
            icon={icons.person}
            value={input.nick}
            onChangeText={(value) => handleInput("nick", value)}
          />
          <InputField
            label="Phone Number"
            placeholder="Enter your phone number"
            icon={icons.chat}
            value={input.phone}
            onChangeText={(value) => handleInput("phone", value)}
            keyboardType="phone-pad"
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={input.password}
            secureTextEntry
            onChangeText={(value) => handleInput("password", value)}
          />

          {/* Member Type Picker */}
          <View className="my-4">
            <Text className="text-lg font-JakartaSemiBold mb-3">
              I want to join as{" "}
              <Text className="text-gray-400 text-sm font-Jakarta">
                (optional)
              </Text>
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {MEMBER_TYPES.map((type) => {
                const isSelected = input.type === type.value;
                const isAdmin = type.value === MemberType.ADMIN;
                const selectedColor = isAdmin ? "#1a1a2e" : "#2D4D23";
                const selectedBg = isAdmin ? "#EEEEF5" : "#F3F9F5";
                return (
                  <TouchableOpacity
                    key={type.value}
                    className={`flex-1 min-w-[30%] p-4 rounded-2xl border-2 ${
                      isSelected
                        ? `bg-[${selectedBg}]`
                        : "border-gray-200 bg-white"
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: selectedColor,
                            backgroundColor: selectedBg,
                          }
                        : undefined
                    }
                    onPress={() => handleInput("type", type.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-base font-JakartaBold text-center ${
                        isSelected ? "" : "text-gray-500"
                      }`}
                      style={isSelected ? { color: selectedColor } : undefined}
                    >
                      {type.label}
                    </Text>
                    <Text
                      className={`text-xs font-Jakarta text-center mt-1 ${
                        isSelected ? "" : "text-gray-400"
                      }`}
                      style={isSelected ? { color: selectedColor } : undefined}
                    >
                      {type.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Admin Secret Code */}
            {input.type === MemberType.ADMIN && (
              <View className="mt-3">
                <InputField
                  label="Admin Secret Code"
                  placeholder="Enter admin secret code"
                  icon={icons.lock}
                  value={input.adminCode}
                  secureTextEntry
                  onChangeText={(value) => handleInput("adminCode", value)}
                />
              </View>
            )}
          </View>

          <CustomButton
            title={loading ? "" : "Sign Up"}
            bgVariant="dark-green"
            className="mt-4"
            onPress={doSignUp}
            disabled={loading}
            IconLeft={
              loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : undefined
            }
          />

          {/* Link to Sign In */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base font-Jakarta text-gray-500">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/sign-in">
              <Text className="text-base font-JakartaBold text-[#2D4D23]">
                Sign In
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
