import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { getToken, signUp } from "@/libs/auth";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  async function check() {
    const token = await getToken();
    if (token) {
      router.replace("/(root)/(tabs)/home");
    }
  }
  useEffect(() => {
    check();
  }, []);
  const [input, setInput] = useState({
    nick: "",
    password: "",
    phone: "",
    type: "USER",
  });

  const handleInput = useCallback((name: any, value: any) => {
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const doSignUp = useCallback(async () => {
    console.log("signup", input);
    try {
      await signUp(input.nick, input.password, input.phone, input.type);
      console.log("signup success");

      await router.replace(`/(root)/(tabs)/home`);
    } catch (err: any) {
      console.log("Error", err);
    }
  }, [input]);
  return (
    <SafeAreaView>
      <View className="bg-blue-500">
        <InputField
          label="Nick name"
          value={input.nick}
          onChangeText={(value) => handleInput("nick", value)}
        />
        <InputField
          label="Password"
          value={input.password}
          onChangeText={(value) => handleInput("password", value)}
        />
        <InputField
          label="Phone Number"
          value={input.phone}
          onChangeText={(value) => handleInput("phone", value)}
        />
      </View>
      <CustomButton title="Sign up" onPress={doSignUp} />
    </SafeAreaView>
  );
}
