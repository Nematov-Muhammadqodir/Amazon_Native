import { useAdminOrders } from "@/hooks/admin/useAdminOrders";
import { OrderStatus } from "@/libs/enums/order.enum";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_FILTERS = ["ALL", ...Object.values(OrderStatus)] as const;

export default function VendorOrders() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);

  const { orders, total, loading } = useAdminOrders({
    page,
    limit: 20,
    search: {
      ...(statusFilter ? { orderStatus: statusFilter } : {}),
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAUSE":
        return { icon: "pause-circle" as const, color: "#F59E0B" };
      case "PROCESS":
        return { icon: "time" as const, color: "#3B82F6" };
      case "FINISH":
        return { icon: "checkmark-circle" as const, color: "#16A34A" };
      case "DELETE":
        return { icon: "close-circle" as const, color: "#EF4444" };
      default:
        return { icon: "help-circle" as const, color: "#9CA3AF" };
    }
  };

  const renderOrder = ({ item }: { item: any }) => {
    const { icon, color } = getStatusIcon(item.orderStatus);
    return (
      <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons name={icon} size={22} color={color} />
            <Text className="font-JakartaBold text-base">
              {item.orderStatus}
            </Text>
          </View>
          <Text className="font-JakartaSemiBold text-[#2D4D23]">
            ${item.orderTotal?.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between mt-3">
          <Text className="font-Jakarta text-gray-500 text-sm">
            Qty: {item.orderQuantity}
          </Text>
          <Text className="font-Jakarta text-gray-400 text-xs">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {item.memberData && (
          <Text className="font-Jakarta text-gray-500 text-sm mt-1">
            By: {item.memberData.memberNick}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
          Orders
        </Text>
        <Text className="text-sm font-Jakarta text-gray-500 mt-1">
          {total} order{total !== 1 ? "s" : ""}
        </Text>
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

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2D4D23" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
                No orders yet
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
