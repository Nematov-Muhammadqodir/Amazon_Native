import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import { useSocket } from "@/hooks/useSocket";
import { getToken, login } from "@/libs/auth";
import { getRoleRoute } from "@/libs/utils/getRoleRoute";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Link, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
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
  });

  const handleInput = useCallback((name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const doLogin = useCallback(async () => {
    if (!input.nick || !input.password) {
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

    setLoading(true);
    try {
      const userData = await login(input.nick, input.password);
      router.replace(getRoleRoute(userData.memberType) as any);
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Login failed");
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
            Welcome Back
          </Text>
          <Text className="text-base font-Jakarta text-gray-500 mt-2">
            Sign in to your account
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
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={input.password}
            secureTextEntry
            onChangeText={(value) => handleInput("password", value)}
          />

          <CustomButton
            title={loading ? "" : "Sign In"}
            bgVariant="dark-green"
            className="mt-6"
            onPress={doLogin}
            disabled={loading}
            IconLeft={
              loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : undefined
            }
          />

          {/* Link to Sign Up */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base font-Jakarta text-gray-500">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/sign-up">
              <Text className="text-base font-JakartaBold text-[#2D4D23]">
                Sign Up
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
