import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { useSocket } from "@/hooks/useSocket";
import { getToken, signUp } from "@/libs/auth";
import { useReactiveVar } from "@apollo/client/react";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const user = useReactiveVar(userVar);
  const { socket } = useSocket(user?._id);

  async function check() {
    const token = await getToken();

    if (token && user._id !== "") {
      router.replace("/(root)/(tabs)/chat");
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
    try {
      const user = await signUp(
        input.nick,
        input.password,
        input.phone,
        input.type
      );

      console.log("user", user);

      useSocket(user._id);

      router.replace("/(root)/(tabs)/home");
    } catch (err: any) {
      console.log("SIGNUP ERROR:", err?.message);
      console.log("FULL ERROR:", JSON.stringify(err, null, 2));
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
          secureTextEntry
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
