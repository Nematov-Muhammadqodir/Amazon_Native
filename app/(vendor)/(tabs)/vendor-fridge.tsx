import { useCreateBorrowRequest } from "@/hooks/vendor/useBorrowRequests";
import { useVendorFridge } from "@/hooks/vendor/useVendorFridge";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function VendorFridgeView() {
  const { vendorId, vendorName } = useLocalSearchParams<{
    vendorId: string;
    vendorName: string;
  }>();

  const { fridgeItems, loading } = useVendorFridge(vendorId || "", {
    page: 1,
    limit: 100,
    search: {},
  });

  const { createBorrowRequest } = useCreateBorrowRequest();
  const [borrowModal, setBorrowModal] = useState<any>(null);
  const [borrowQty, setBorrowQty] = useState("");
  const [borrowPrice, setBorrowPrice] = useState("");
  const [borrowMsg, setBorrowMsg] = useState("");

  const handleBorrow = async () => {
    if (!borrowQty || Number(borrowQty) <= 0) {
      await sweetErrorAlert("Enter a valid quantity");
      return;
    }
    if (Number(borrowQty) > borrowModal.currentStock) {
      await sweetErrorAlert(`Only ${borrowModal.currentStock} ${borrowModal.unit} available`);
      return;
    }
    try {
      await createBorrowRequest({
        targetVendorId: vendorId,
        productName: borrowModal.productName,
        quantity: Number(borrowQty),
        unit: borrowModal.unit,
        unitPrice: Number(borrowPrice) || 0,
        message: borrowMsg.trim() || undefined,
      });
      Toast.show({
        type: "success",
        text1: "Request sent!",
        text2: `Waiting for ${vendorName} to approve`,
      });
      setBorrowModal(null);
      setBorrowQty("");
      setBorrowPrice("");
      setBorrowMsg("");
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Request failed");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-JakartaBold text-base">{item.productName}</Text>
          {item.productCollection ? (
            <View className="flex-row mt-1">
              <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-Jakarta text-gray-500">
                  {item.productCollection.replace(/_/g, " ")}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="text-xl font-JakartaExtraBold text-[#2D4D23]">
            {item.currentStock}
          </Text>
          <Text className="text-xs text-gray-400 font-Jakarta">{item.unit}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setBorrowModal(item)}
        className="mt-3 bg-[#1a1a2e] py-2.5 rounded-full flex-row items-center justify-center gap-2"
      >
        <Ionicons name="hand-left-outline" size={16} color="white" />
        <Text className="text-white font-JakartaBold text-xs">Request to Borrow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-JakartaExtraBold text-[#1a1a2e]">
              {vendorName}'s Stock
            </Text>
            <Text className="text-xs font-Jakarta text-gray-500">
              {fridgeItems.length} products available
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1a1a2e" className="mt-10" />
      ) : (
        <FlatList
          data={fridgeItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 }}
          ListEmptyComponent={
            <View className="items-center mt-16">
              <MaterialCommunityIcons name="fridge-off-outline" size={50} color="#ccc" />
              <Text className="font-JakartaBold text-gray-400 mt-3">No products available</Text>
            </View>
          }
        />
      )}

      {/* Borrow Request Modal */}
      <Modal visible={!!borrowModal} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center px-8">
          <View className="bg-white rounded-3xl p-6">
            <Text className="text-lg font-JakartaExtraBold text-[#1a1a2e] mb-1">
              Borrow Request
            </Text>
            <Text className="font-Jakarta text-gray-500 mb-1">
              {borrowModal?.productName}
            </Text>
            <Text className="text-xs text-gray-400 font-Jakarta mb-4">
              Available: {borrowModal?.currentStock} {borrowModal?.unit}
            </Text>

            <TextInput
              className="bg-neutral-100 rounded-full p-4 font-JakartaBold text-center text-xl mb-3"
              placeholder="Quantity"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={borrowQty}
              onChangeText={setBorrowQty}
              autoFocus
            />

            <TextInput
              className="bg-neutral-100 rounded-full p-3 font-Jakarta text-sm mb-3"
              placeholder="Unit price ₩ (optional)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={borrowPrice}
              onChangeText={setBorrowPrice}
            />

            <TextInput
              className="bg-neutral-100 rounded-2xl p-3 font-Jakarta text-sm mb-4"
              placeholder="Message (optional)"
              placeholderTextColor="#9CA3AF"
              value={borrowMsg}
              onChangeText={setBorrowMsg}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => { setBorrowModal(null); setBorrowQty(""); setBorrowPrice(""); setBorrowMsg(""); }}
                className="flex-1 py-3 rounded-full border border-gray-200 items-center"
              >
                <Text className="font-JakartaSemiBold text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBorrow}
                className="flex-1 py-3 rounded-full bg-[#1a1a2e] items-center"
              >
                <Text className="font-JakartaSemiBold text-white">Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
