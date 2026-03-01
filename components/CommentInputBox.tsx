import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

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

  return (
    <View className={`w-full px-4 mt-8 ${classname}`}>
      <View className="bg-white rounded-2xl border border-gray-200 p-3 flex-row items-end h-[100px]">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-[15px] max-h-[120px]"
          style={{ textAlignVertical: "top" }}
        />

        <Pressable
          onPress={onSubmit}
          disabled={isDisabled}
          className={`ml-3 px-4 py-2 rounded-full ${
            isDisabled ? "bg-gray-300" : "bg-[#0286FF]"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-JakartaSemiBold">Send</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
