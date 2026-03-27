import VendorAIChatRoom from "@/components/VendorAIChatRoom";
import { useFridge } from "@/hooks/vendor/useFridge";
import { logOut } from "@/libs/auth";
import { FridgeItemStatus } from "@/libs/enums/fridge.enum";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_FILTERS = ["ALL", "ACTIVE", "FINISHED"] as const;

export default function MyProducts() {
  const [chatVisible, setChatVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState("");

  const { fridgeItems, total, loading, refetch, updateFridgeItem } = useFridge({
    page: 1,
    limit: 100,
    sort: "productName",
    direction: "ASC",
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

  const getStockColor = (stock: number) => {
    if (stock <= 0) return "text-red-600";
    if (stock <= 5) return "text-orange-500";
    return "text-[#2D4D23]";
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="font-JakartaBold text-base" numberOfLines={1}>
            {item.productName}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            {item.productCollection ? (
              <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-Jakarta text-gray-500">
                  {item.productCollection.replace(/_/g, " ")}
                </Text>
              </View>
            ) : null}
            <View
              className={`px-2 py-0.5 rounded-full ${
                item.itemStatus === FridgeItemStatus.ACTIVE
                  ? "bg-green-100"
                  : "bg-orange-100"
              }`}
            >
              <Text
                className={`text-[10px] font-JakartaSemiBold ${
                  item.itemStatus === FridgeItemStatus.ACTIVE
                    ? "text-green-700"
                    : "text-orange-700"
                }`}
              >
                {item.itemStatus}
              </Text>
            </View>
          </View>
          {item.memo ? (
            <Text className="text-xs text-gray-400 font-Jakarta mt-1">
              {item.memo}
            </Text>
          ) : null}
        </View>

        <View className="items-end">
          <Text
            className={`text-2xl font-JakartaExtraBold ${getStockColor(item.currentStock)}`}
          >
            {item.currentStock}
          </Text>
          <Text className="text-xs text-gray-400 font-Jakarta">
            {item.unit}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <Text className="text-[10px] text-gray-300 font-Jakarta">
          Updated: {new Date(item.updatedAt).toLocaleDateString("ko-KR")}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => {
              updateFridgeItem({
                _id: item._id,
                currentStock: Math.max(0, item.currentStock - 1),
              }).then(() => refetch());
            }}
            className="bg-red-50 px-3 py-1.5 rounded-lg"
          >
            <Ionicons name="remove" size={14} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateFridgeItem({
                _id: item._id,
                currentStock: item.currentStock + 1,
              }).then(() => refetch());
            }}
            className="bg-green-50 px-3 py-1.5 rounded-lg"
          >
            <Ionicons name="add" size={14} color="#16A34A" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="fridge" size={24} color="#2D4D23" />
              <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
                My Products
              </Text>
            </View>
            <Text className="text-sm font-Jakarta text-gray-500 mt-1">
              {total} item{total !== 1 ? "s" : ""} in fridge
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push("/(root)/profile")}
              className="bg-white p-3 rounded-full shadow-sm"
            >
              <Ionicons name="person-outline" size={20} color="#2D4D23" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logOut}
              className="bg-white p-3 rounded-full shadow-sm"
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Navigation */}
      <View className="px-5 mb-3 flex-row gap-2">
        <TouchableOpacity
          onPress={() => router.push("/(vendor)/(tabs)/orders" as any)}
          className="flex-1 flex-row items-center justify-center gap-1 bg-white border border-gray-200 py-3 rounded-xl"
        >
          <Ionicons name="receipt-outline" size={18} color="#E9AB18" />
          <Text className="font-JakartaSemiBold text-xs text-gray-700">
            Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 border border-gray-200">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 font-Jakarta text-[15px]"
            placeholder="Search by product name..."
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

      {/* Product List from Fridge */}
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
                No products yet
              </Text>
              <Text className="font-Jakarta text-gray-400 mt-1">
                Buy products in Daily Purchases to fill your fridge
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>

      <Pressable
        onPress={() => setChatVisible(true)}
        className="absolute bottom-28 right-5 w-14 h-14 rounded-full bg-[#1a5c2e] items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <Ionicons name="analytics" size={26} color="white" />
      </Pressable>

      <VendorAIChatRoom visible={chatVisible} onClose={() => setChatVisible(false)} />
    </>
  );
}
