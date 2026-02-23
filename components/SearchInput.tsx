import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SearchInput() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="relative">
          <TextInput
            placeholder="Search For Anything"
            placeholderTextColor="#9CA3AF" // <
            className="border-2 py-2 px-7 rounded-full border-gray-200"
          />
          <TouchableOpacity
            className="absolute right-[2] bg-[#FDBF12] py-2 rounded-full px-8 top-[1.8]"
            onPress={() => {
              Keyboard.dismiss();
              console.log("Search pressed");
            }}
          >
            <View className="flex flex-row gap-2 items-center">
              <Text className="font-JakartaExtraBold">Search</Text>
              <Octicons name="search" size={14} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
