import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { ProductStatus } from "@/libs/enums/product.enum";
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

const STATUS_FILTERS = ["ALL", ...Object.values(ProductStatus)] as const;

export default function AdminProducts() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);

  const {
    products,
    total,
    loading,
    refetch,
    updateProductByAdmin,
    deleteProductByAdmin,
  } = useAdminProducts({
    page,
    limit: 20,
    search: {
      ...(statusFilter ? { productStatus: statusFilter } : {}),
    },
  });

  const handleStatusChange = (productId: string, currentStatus: string) => {
    const options = Object.values(ProductStatus).filter(
      (s) => s !== currentStatus
    );
    Alert.alert("Change Status", `Current: ${currentStatus}`, [
      ...options.map((status) => ({
        text: status,
        onPress: async () => {
          try {
            await updateProductByAdmin({
              _id: productId,
              productStatus: status,
            });
            Toast.show({
              type: "success",
              text1: `Status changed to ${status}`,
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

  const handleDelete = (productId: string, name: string) => {
    Alert.alert("Delete Product", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProductByAdmin(productId);
            Toast.show({ type: "success", text1: "Product deleted" });
            refetch();
          } catch (err: any) {
            sweetErrorAlert(err?.message || "Delete failed");
          }
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "SOLD":
        return "bg-orange-100 text-orange-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderProduct = ({ item }: { item: any }) => {
    const imageUri = item.productImages?.[0]
      ? `${process.env.EXPO_PUBLIC_API_URL}/${item.productImages[0]}`
      : null;

    return (
      <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
        <View className="flex-row items-center">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-16 h-16 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 rounded-xl bg-gray-200 items-center justify-center">
              <Ionicons name="image-outline" size={24} color="#999" />
            </View>
          )}
          <View className="flex-1 ml-3">
            <Text className="font-JakartaBold text-base" numberOfLines={1}>
              {item.productName}
            </Text>
            <Text className="font-Jakarta text-gray-500 text-sm">
              ${item.productPrice?.toLocaleString()}
              {item.productDiscountRate > 0 && (
                <Text className="text-red-500">
                  {" "}
                  -{item.productDiscountRate}%
                </Text>
              )}
            </Text>
            {item.productOwnerData && (
              <Text className="font-Jakarta text-gray-400 text-xs mt-1">
                by {item.productOwnerData.memberNick}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row gap-2 items-center">
            <TouchableOpacity
              onPress={() =>
                handleStatusChange(item._id, item.productStatus)
              }
              className={`px-3 py-1 rounded-full ${getStatusColor(item.productStatus)}`}
            >
              <Text className="text-xs font-JakartaSemiBold">
                {item.productStatus}
              </Text>
            </TouchableOpacity>
            <Text className="text-xs text-gray-400">
              Stock: {item.productLeftCount}
            </Text>
            <Text className="text-xs text-gray-400">
              Sold: {item.productSoldCount}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item._id, item.productName)}
            className="p-2"
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F2F5]" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-JakartaExtraBold text-[#1a1a2e]">
          Products
        </Text>
        <Text className="text-sm font-Jakarta text-gray-500 mt-1">
          {total} product{total !== 1 ? "s" : ""}
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
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Ionicons name="cube-outline" size={60} color="#ccc" />
              <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
                No products found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
