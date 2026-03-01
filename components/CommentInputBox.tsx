import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Text, TextInput, useWindowDimensions, View } from "react-native";
import CustomButton from "./CustomButton";

interface CommentInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
  classname?: string;
}

export default function CommentInputBox({
  value,
  onChangeText,
  onSubmit,
  loading = false,
  placeholder = "Write a comment...",
  classname,
}: CommentInputBoxProps) {
  const isDisabled = !value.trim() || loading;
  const { width, height } = useWindowDimensions();
  const eightyPercent = width * 0.9;

  return (
    <View
      className={`w-full py-10 mt-8 bg-[#FFF7ED] flex justify-center items-center ${classname}`}
    >
      <View className="flex flex-row gap-2 justify-center">
        <Text className="font-JakartaBold text-[20px] mb-3">
          Let Us Know What You Think
        </Text>
        <FontAwesome5 name="comments" size={24} color="black" />
      </View>
      <View
        className="bg-white rounded-2xl border  border-gray-200 p-3 flex-row items-end h-[100px]"
        style={{ width: eightyPercent }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-[15px] max-h-[120px]"
          style={{ textAlignVertical: "top" }}
        />

        <CustomButton
          title="Send"
          className="w-[100px]"
          bgVariant="dark-green"
          textStyle=" font-JakartaMedium"
        />
      </View>
    </View>
  );
}
