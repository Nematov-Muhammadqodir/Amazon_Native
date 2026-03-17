import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import { useVendorProducts } from "@/hooks/vendor/useVendorProducts";
import { logOut } from "@/libs/auth";
import { ProductStatus } from "@/libs/enums/product.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_FILTERS = ["ALL", ...Object.values(ProductStatus)] as const;

export default function MyProducts() {
  const user = useReactiveVar(userVar);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);

  const { products, total, loading, refetch, updateProduct } =
    useVendorProducts({
      page,
      limit: 10,
      sort: "createdAt",
      direction: "DESC",
      search: {
        ...(statusFilter ? { productStatus: statusFilter } : {}),
      },
    });

  const handleStatusChange = async (
    productId: string,
    newStatus: ProductStatus
  ) => {
    try {
      await updateProduct({ _id: productId, productStatus: newStatus });
      refetch();
    } catch (err: any) {
      sweetErrorAlert(err?.message || "Update failed");
    }
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
      <View className="bg-white rounded-2xl mb-3 p-4 flex-row items-center shadow-sm">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-20 h-20 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-xl bg-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={30} color="#999" />
          </View>
        )}

        <View className="flex-1 ml-4">
          <Text className="font-JakartaBold text-base" numberOfLines={1}>
            {item.productName}
          </Text>
          <Text className="font-Jakarta text-gray-500 text-sm mt-1">
            ${item.productPrice?.toLocaleString()}
            {item.productDiscountRate > 0 && (
              <Text className="text-red-500">
                {" "}
                -{item.productDiscountRate}%
              </Text>
            )}
          </Text>
          <View className="flex-row items-center mt-2 gap-2">
            <View className={`px-2 py-1 rounded-full ${getStatusColor(item.productStatus)}`}>
              <Text className="text-xs font-JakartaSemiBold">
                {item.productStatus}
              </Text>
            </View>
            <Text className="text-xs text-gray-400 font-Jakarta">
              Stock: {item.productLeftCount}
            </Text>
          </View>
        </View>

        <View className="flex-col gap-2">
          {item.productStatus === "ACTIVE" && (
            <TouchableOpacity
              onPress={() => handleStatusChange(item._id, ProductStatus.SOLD)}
              className="bg-orange-50 p-2 rounded-lg"
            >
              <MaterialIcons name="sell" size={18} color="#EA580C" />
            </TouchableOpacity>
          )}
          {item.productStatus === "SOLD" && (
            <TouchableOpacity
              onPress={() => handleStatusChange(item._id, ProductStatus.ACTIVE)}
              className="bg-green-50 p-2 rounded-lg"
            >
              <Ionicons name="refresh" size={18} color="#16A34A" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
              My Products
            </Text>
            <Text className="text-sm font-Jakarta text-gray-500 mt-1">
              {total} product{total !== 1 ? "s" : ""} total
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
                  isSelected ? "bg-[#2D4D23]" : "bg-white border border-gray-200"
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

      {/* Product List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2D4D23" />
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
                No products yet
              </Text>
              <Text className="font-Jakarta text-gray-400 mt-1">
                Start by adding your first product
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
