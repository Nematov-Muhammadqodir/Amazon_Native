import { useAdminOrders } from "@/hooks/admin/useAdminOrders";
import { OrderStatus } from "@/libs/enums/order.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const STATUS_FILTERS = ["ALL", ...Object.values(OrderStatus)] as const;

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);

  const { orders, total, loading, refetch, updateOrderByAdmin } =
    useAdminOrders({
      page,
      limit: 20,
      search: {
        ...(statusFilter ? { orderStatus: statusFilter } : {}),
      },
    });

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    const options = Object.values(OrderStatus).filter(
      (s) => s !== currentStatus
    );
    Alert.alert("Update Order Status", `Current: ${currentStatus}`, [
      ...options.map((status) => ({
        text: status,
        onPress: async () => {
          try {
            await updateOrderByAdmin({
              orderId,
              orderStatus: status,
            });
            Toast.show({
              type: "success",
              text1: `Order updated to ${status}`,
            });
            refetch();
          } catch (err: any) {
            sweetErrorAlert(err?.message || "Update failed");
          }
        },
      })),
      { text: "Cancel", style: "cancel" as const },
    ]);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PAUSE":
        return { bg: "bg-yellow-100", text: "text-yellow-700", icon: "pause-circle" as const, color: "#F59E0B" };
      case "PROCESS":
        return { bg: "bg-blue-100", text: "text-blue-700", icon: "time" as const, color: "#3B82F6" };
      case "FINISH":
        return { bg: "bg-green-100", text: "text-green-700", icon: "checkmark-circle" as const, color: "#16A34A" };
      case "DELETE":
        return { bg: "bg-red-100", text: "text-red-700", icon: "close-circle" as const, color: "#EF4444" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: "help-circle" as const, color: "#9CA3AF" };
    }
  };

  const renderOrder = ({ item }: { item: any }) => {
    const style = getStatusStyle(item.orderStatus);
    const memberImage = item.memberData?.memberImage
      ? `${process.env.EXPO_PUBLIC_API_URL}/${item.memberData.memberImage}`
      : null;

    return (
      <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {memberImage ? (
              <Image
                source={{ uri: memberImage }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                <Ionicons name="person" size={18} color="#999" />
              </View>
            )}
            <View>
              <Text className="font-JakartaBold text-base">
                {item.memberData?.memberNick || "Unknown"}
              </Text>
              <Text className="font-Jakarta text-gray-400 text-xs">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Text className="font-JakartaExtraBold text-lg">
            ${item.orderTotal?.toLocaleString()}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row gap-2 items-center">
            <TouchableOpacity
              onPress={() => handleStatusChange(item._id, item.orderStatus)}
              className={`px-3 py-1 rounded-full flex-row items-center gap-1 ${style.bg}`}
            >
              <Ionicons name={style.icon} size={14} color={style.color} />
              <Text className={`text-xs font-JakartaSemiBold ${style.text}`}>
                {item.orderStatus}
              </Text>
            </TouchableOpacity>
            <Text className="text-xs text-gray-400 font-Jakarta">
              Qty: {item.orderQuantity}
            </Text>
          </View>
          {item.memberData?.memberPhone && (
            <Text className="text-xs text-gray-400 font-Jakarta">
              {item.memberData.memberPhone}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F2F5]" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-JakartaExtraBold text-[#1a1a2e]">
          Orders
        </Text>
        <Text className="text-sm font-Jakarta text-gray-500 mt-1">
          {total} order{total !== 1 ? "s" : ""}
        </Text>
      </View>

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
                    ? "bg-[#1a1a2e]"
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
          <ActivityIndicator size="large" color="#1a1a2e" />
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
                No orders found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
