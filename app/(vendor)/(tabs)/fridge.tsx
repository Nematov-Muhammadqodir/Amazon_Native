import { useFridge } from "@/hooks/vendor/useFridge";
import { FridgeItemStatus } from "@/libs/enums/fridge.enum";
import { ProductCollection } from "@/libs/enums/product.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const STATUS_FILTERS = ["ALL", "ACTIVE", "FINISHED"] as const;
const COLLECTIONS = Object.values(ProductCollection).filter(
  (c) => c !== "ALL"
);
const UNITS = ["kg", "box", "bag", "piece", "bundle", "crate"];

export default function Fridge() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockTarget, setRestockTarget] = useState<any>(null);

  const {
    fridgeItems,
    total,
    loading,
    refetch,
    addFridgeItem,
    restockFridgeItem,
    updateFridgeItem,
    deleteFridgeItem,
  } = useFridge({
    page: 1,
    limit: 50,
    sort: "updatedAt",
    direction: "DESC",
    search: {
      ...(statusFilter ? { itemStatus: statusFilter } : {}),
      ...(searchText ? { text: searchText } : {}),
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Add form state
  const [addForm, setAddForm] = useState({
    productName: "",
    productCollection: "" as ProductCollection,
    currentStock: "",
    unit: "kg",
    memo: "",
  });

  const [restockAmount, setRestockAmount] = useState("");

  const handleAdd = async () => {
    if (!addForm.productName || !addForm.productCollection || !addForm.currentStock) {
      await sweetErrorAlert("Fill in name, category, and stock");
      return;
    }
    try {
      await addFridgeItem({
        productName: addForm.productName,
        productCollection: addForm.productCollection,
        currentStock: Number(addForm.currentStock),
        unit: addForm.unit,
        memo: addForm.memo || undefined,
      });
      Toast.show({ type: "success", text1: "Added to fridge!" });
      setShowAddModal(false);
      setAddForm({
        productName: "",
        productCollection: "" as ProductCollection,
        currentStock: "",
        unit: "kg",
        memo: "",
      });
      refetch();
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Failed to add");
    }
  };

  const handleRestock = async () => {
    if (!restockAmount || Number(restockAmount) <= 0) {
      await sweetErrorAlert("Enter a valid amount");
      return;
    }
    try {
      await restockFridgeItem({
        productName: restockTarget.productName,
        productCollection: restockTarget.productCollection,
        amount: Number(restockAmount),
        unit: restockTarget.unit,
      });
      Toast.show({
        type: "success",
        text1: `+${restockAmount}${restockTarget.unit} added!`,
      });
      setShowRestockModal(false);
      setRestockAmount("");
      setRestockTarget(null);
      refetch();
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Restock failed");
    }
  };

  const handleStockAdjust = (item: any, delta: number) => {
    const newStock = item.currentStock + delta;
    if (newStock < 0) return;
    updateFridgeItem({ _id: item._id, currentStock: newStock })
      .then(() => refetch())
      .catch((err: any) => sweetErrorAlert(err?.message || "Update failed"));
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      "Remove from fridge",
      `Remove "${item.productName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFridgeItem(item._id);
              Toast.show({ type: "success", text1: "Removed" });
              refetch();
            } catch (err: any) {
              sweetErrorAlert(err?.message || "Delete failed");
            }
          },
        },
      ]
    );
  };

  const getStockColor = (stock: number) => {
    if (stock <= 0) return "text-red-600";
    if (stock <= 5) return "text-orange-500";
    return "text-[#2D4D23]";
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="fridge-outline"
              size={18}
              color="#2D4D23"
            />
            <Text className="font-JakartaBold text-base" numberOfLines={1}>
              {item.productName}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="bg-gray-100 px-2 py-0.5 rounded-full">
              <Text className="text-xs font-Jakarta text-gray-600">
                {item.productCollection?.replace(/_/g, " ")}
              </Text>
            </View>
            {item.itemStatus === "FINISHED" && (
              <View className="bg-red-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-JakartaSemiBold text-red-600">
                  EMPTY
                </Text>
              </View>
            )}
          </View>
          {item.memo ? (
            <Text className="text-xs text-gray-400 font-Jakarta mt-1">
              {item.memo}
            </Text>
          ) : null}
        </View>

        {/* Stock display + controls */}
        <View className="items-center">
          <Text className={`text-2xl font-JakartaExtraBold ${getStockColor(item.currentStock)}`}>
            {item.currentStock}
          </Text>
          <Text className="text-xs text-gray-400 font-Jakarta">
            {item.unit}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row gap-2">
          {/* Decrease */}
          <TouchableOpacity
            onPress={() => handleStockAdjust(item, -1)}
            className="bg-red-50 px-3 py-2 rounded-lg flex-row items-center gap-1"
          >
            <Ionicons name="remove" size={16} color="#EF4444" />
            <Text className="text-xs font-JakartaSemiBold text-red-600">1</Text>
          </TouchableOpacity>

          {/* Increase */}
          <TouchableOpacity
            onPress={() => handleStockAdjust(item, 1)}
            className="bg-green-50 px-3 py-2 rounded-lg flex-row items-center gap-1"
          >
            <Ionicons name="add" size={16} color="#16A34A" />
            <Text className="text-xs font-JakartaSemiBold text-green-600">1</Text>
          </TouchableOpacity>

          {/* Restock (bulk add) */}
          <TouchableOpacity
            onPress={() => {
              setRestockTarget(item);
              setShowRestockModal(true);
            }}
            className="bg-blue-50 px-3 py-2 rounded-lg flex-row items-center gap-1"
          >
            <Ionicons name="cart" size={16} color="#3B82F6" />
            <Text className="text-xs font-JakartaSemiBold text-blue-600">
              Restock
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleDelete(item)} className="p-2">
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <Text className="text-[10px] text-gray-300 font-Jakarta mt-2">
        Updated: {new Date(item.updatedAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="fridge"
                size={26}
                color="#2D4D23"
              />
              <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
                Cold Storage
              </Text>
            </View>
            <Text className="text-sm font-Jakarta text-gray-500 mt-1">
              {total} item{total !== 1 ? "s" : ""} tracked
            </Text>
          </View>
          <View className="bg-gray-100 px-3 py-2 rounded-full">
            <Text className="text-xs font-Jakarta text-gray-500">
              Auto-filled from purchases
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 border border-gray-200">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 font-Jakarta text-[15px]"
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Status Filter */}
      <View className="px-5 mb-3">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STATUS_FILTERS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected =
              item === "ALL" ? !statusFilter : statusFilter === item;
            return (
              <TouchableOpacity
                onPress={() =>
                  setStatusFilter(item === "ALL" ? undefined : item)
                }
                className={`mr-2 px-4 py-2 rounded-full ${
                  isSelected
                    ? "bg-[#2D4D23]"
                    : "bg-white border border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-JakartaSemiBold ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2D4D23" />
        </View>
      ) : (
        <FlatList
          data={fridgeItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <MaterialCommunityIcons
                name="fridge-off-outline"
                size={60}
                color="#ccc"
              />
              <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
                Fridge is empty
              </Text>
              <Text className="font-Jakarta text-gray-400 mt-1">
                Add products to track your cold storage
              </Text>
            </View>
          }
        />
      )}

      {/* ===== RESTOCK MODAL ===== */}
      <Modal visible={showRestockModal} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center px-8">
          <View className="bg-white rounded-3xl p-6">
            <Text className="text-lg font-JakartaExtraBold text-[#2D4D23] mb-1">
              Restock
            </Text>
            <Text className="font-Jakarta text-gray-500 mb-4">
              How much "{restockTarget?.productName}" did you buy today?
            </Text>
            <TextInput
              className="bg-neutral-100 rounded-full p-4 font-JakartaBold text-center text-xl mb-4"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={restockAmount}
              onChangeText={setRestockAmount}
              autoFocus
            />
            <Text className="text-center text-gray-400 font-Jakarta mb-4">
              Current: {restockTarget?.currentStock} {restockTarget?.unit} →
              New total: {(restockTarget?.currentStock ?? 0) + (Number(restockAmount) || 0)}{" "}
              {restockTarget?.unit}
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowRestockModal(false);
                  setRestockAmount("");
                }}
                className="flex-1 py-3 rounded-full border border-gray-200 items-center"
              >
                <Text className="font-JakartaSemiBold text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRestock}
                className="flex-1 py-3 rounded-full bg-[#2D4D23] items-center"
              >
                <Text className="font-JakartaSemiBold text-white">
                  Restock
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
