import { ASK_VENDOR_AI_AGENT } from "@/apollo/ai-agent/mutation";
import { userVar } from "@/apollo/store";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useMutation, useReactiveVar } from "@apollo/client/react";

import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
  id: string;
  text: string;
  role: "vendor" | "assistant";
  createdAt: Date;
};

export default function VendorAIChatRoom({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const currentUser = useReactiveVar(userVar);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm your AI business assistant. I can help you analyze your sales, check inventory, track loans, find top customers, and more. What would you like to know?",
      role: "assistant",
      createdAt: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [askVendorAgent] = useMutation<{ askVendorAiAgent: string }>(
    ASK_VENDOR_AI_AGENT
  );

  const sendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      role: "vendor",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const { data, errors } = await askVendorAgent({
        variables: { question: trimmed },
      });

      if (errors?.length) {
        await sweetErrorAlert(errors[0].message || "Something went wrong");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.askVendorAiAgent || "No response received.",
        role: "assistant",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please try again.",
        role: "assistant",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      await sweetErrorAlert(error.message || "Something went wrong");
    } finally {
      setIsTyping(false);
    }
  }, [inputText, isTyping, askVendorAgent]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role !== "assistant";
    return (
      <View
        className={`flex-row ${isUser ? "justify-end" : "justify-start"} mb-3 px-4`}
      >
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-[#1a5c2e] items-center justify-center mr-2 mt-1">
            <Ionicons name="analytics" size={16} color="white" />
          </View>
        )}
        <View
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
            isUser ? "bg-[#2D4D23] rounded-br-sm" : "bg-gray-100 rounded-bl-sm"
          }`}
        >
          <Text
            className={`text-sm font-Jakarta ${isUser ? "text-white" : "text-gray-800"}`}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-[#1a5c2e] items-center justify-center">
              <Ionicons name="analytics" size={20} color="white" />
            </View>
            <View>
              <Text className="text-base font-JakartaBold text-gray-900">
                Vendor AI Assistant
              </Text>
              <Text className="text-xs font-Jakarta text-green-600">
                Business Intelligence
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="close" size={22} color="#333" />
          </Pressable>
        </View>

        {/* Messages */}
        <View className="flex-1">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingVertical: 16 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          />

          {isTyping && (
            <View className="flex-row items-center px-4 pb-2 gap-2">
              <ActivityIndicator size="small" color="#1a5c2e" />
              <Text className="text-xs text-gray-500 font-Jakarta">
                Analyzing your data...
              </Text>
            </View>
          )}

          {/* Input */}
          <View
            className="flex-row items-end px-4 py-3 border-t border-gray-200 gap-2"
            style={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight : 12 }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your business..."
              placeholderTextColor="#9ca3af"
              multiline
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm font-Jakarta text-gray-800 max-h-24"
              onSubmitEditing={sendMessage}
            />
            <Pressable
              onPress={sendMessage}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                inputText.trim() && !isTyping ? "bg-[#1a5c2e]" : "bg-gray-300"
              }`}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons name="send" size={18} color="white" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
