import "@/global.css";
import { getToken, updateUserInfo } from "@/libs/auth";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

export default function InitialEnter() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      if (token) {
        updateUserInfo(token);
      } else {
        router.replace("/sign-up");
      }
    };

    checkAuth();
  }, []);
  return <Redirect href="/sign-up" />;
}
