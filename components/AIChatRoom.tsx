import { ASK_AI_AGENT } from "@/apollo/ai-agent/query";
import { userVar } from "@/apollo/store";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useLazyQuery, useReactiveVar } from "@apollo/client/react";

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

type MessageRole = "USER" | "ADMIN" | "VENDOR" | "assistant";

type Message = {
  id: string;
  text: string;
  role: MessageRole;
  createdAt: Date;
};

export default function AIChatRoom({
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
      text: "Hi there! I'm your AI assistant. How can I help you today?",
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

  const [askAiAgent] = useLazyQuery<{ askAiAgent: string }>(ASK_AI_AGENT, {
    fetchPolicy: "network-only",
  });

  const sendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      role: (currentUser.memberType as MessageRole) || "USER",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const { data, error } = await askAiAgent({
        variables: { question: trimmed },
      });

      if (error) {
        await sweetErrorAlert(error.message || "Something went wrong");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.askAiAgent || "No response received.",
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
  }, [inputText, isTyping, currentUser.memberType, askAiAgent]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role !== "assistant";
    return (
      <View
        className={`flex-row ${isUser ? "justify-end" : "justify-start"} mb-3 px-4`}
      >
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-[#2D4D23] items-center justify-center mr-2 mt-1">
            <Ionicons name="sparkles" size={16} color="white" />
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
            <View className="w-10 h-10 rounded-full bg-[#2D4D23] items-center justify-center">
              <Ionicons name="sparkles" size={20} color="white" />
            </View>
            <View>
              <Text className="text-base font-JakartaBold text-gray-900">
                AI Assistant
              </Text>
              <Text className="text-xs font-Jakarta text-green-600">
                Online
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
              <ActivityIndicator size="small" color="#2D4D23" />
              <Text className="text-xs text-gray-500 font-Jakarta">
                AI is typing...
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
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              multiline
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm font-Jakarta text-gray-800 max-h-24"
              onSubmitEditing={sendMessage}
            />
            <Pressable
              onPress={sendMessage}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                inputText.trim() && !isTyping ? "bg-[#2D4D23]" : "bg-gray-300"
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
