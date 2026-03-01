import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { Messages } from "./config";

/* ================================
   ERROR HANDLING
================================ */

export const sweetErrorHandling = async (err: any) => {
  const message = err?.message || "Something went wrong";

  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
  });
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
  const message = err?.message ?? Messages.error1;

  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
  });
};

/* ================================
   SUCCESS ALERTS
================================ */

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  Toast.show({
    type: "success",
    text1: msg.replace("Definer: ", ""),
    visibilityTime: duration,
  });
};

export const sweetMixinSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  Toast.show({
    type: "success",
    text1: msg,
    visibilityTime: duration,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000,
  enable_forward: boolean = false
) => {
  Toast.show({
    type: "success",
    text1: msg,
    visibilityTime: duration,
  });

  if (enable_forward) {
    setTimeout(() => {
      // in React Native you don't reload
      // you navigate instead
    }, duration);
  }
};

/* ================================
   ERROR ALERT
================================ */

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
  Toast.show({
    type: "error",
    text1: msg,
    visibilityTime: duration,
  });
};

export const sweetMixinErrorAlert = async (
  msg: string,
  duration: number = 3000
) => {
  Toast.show({
    type: "error",
    text1: msg,
    visibilityTime: duration,
  });
};

/* ================================
   BASIC ALERT
================================ */

export const sweetBasicAlert = async (text: string) => {
  Alert.alert("Notice", text);
};

/* ================================
   CONTACT ALERT
================================ */

export const sweetContactAlert = async (
  msg: string,
  duration: number = 10000
) => {
  Toast.show({
    type: "info",
    text1: msg,
    visibilityTime: duration,
  });
};

/* ================================
   CONFIRM ALERT
================================ */

export const sweetConfirmAlert = (msg: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert("Confirm", msg, [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => resolve(false),
      },
      {
        text: "Confirm",
        onPress: () => resolve(true),
      },
    ]);
  });
};

/* ================================
   LOGIN CONFIRM ALERT
================================ */

export const sweetLoginConfirmAlert = (msg: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert("Login Required", msg, [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => resolve(false),
      },
      {
        text: "Login",
        onPress: () => resolve(true),
      },
    ]);
  });
};
