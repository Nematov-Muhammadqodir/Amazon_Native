import { userVar } from "@/apollo/store";
import { useFridge } from "@/hooks/vendor/useFridge";
import { useVendorProducts } from "@/hooks/vendor/useVendorProducts";
import { logOut } from "@/libs/auth";
import { ProductStatus } from "@/libs/enums/product.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const STATUS_FILTERS = ["ALL", ...Object.values(ProductStatus)] as const;

export default function MyProducts() {
  const user = useReactiveVar(userVar);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const { products, total, loading, refetch, updateProduct } =
    useVendorProducts({
      page,
      limit: 10,
      sort: "createdAt",
      direction: "DESC",
      search: {
        ...(statusFilter ? { productStatus: statusFilter } : {}),
        ...(searchText ? { text: searchText } : {}),
      },
    });

  const { addFridgeItem } = useFridge({
    page: 1,
    limit: 1,
    search: {},
  });

  const [fridgeModal, setFridgeModal] = useState<any>(null);
  const [fridgeAmount, setFridgeAmount] = useState("");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleSendToFridge = async () => {
    if (!fridgeAmount || Number(fridgeAmount) <= 0) {
      await sweetErrorAlert("Enter a valid quantity");
      return;
    }
    try {
      await addFridgeItem({
        productName: fridgeModal.productName,
        productCollection: fridgeModal.productCollection,
        currentStock: Number(fridgeAmount),
      });
      Toast.show({
        type: "success",
        text1: `${fridgeAmount} units sent to fridge!`,
      });
      setFridgeModal(null);
      setFridgeAmount("");
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Failed to add to fridge");
    }
  };

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
    console.log("imageUri", imageUri);

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
            <View
              className={`px-2 py-1 rounded-full ${getStatusColor(item.productStatus)}`}
            >
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
            <>
              <TouchableOpacity
                onPress={() => setFridgeModal(item)}
                className="bg-blue-50 p-2 rounded-lg"
              >
                <MaterialCommunityIcons
                  name="fridge-outline"
                  size={18}
                  color="#3B82F6"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleStatusChange(item._id, ProductStatus.SOLD)}
                className="bg-orange-50 p-2 rounded-lg"
              >
                <MaterialIcons name="sell" size={18} color="#EA580C" />
              </TouchableOpacity>
            </>
          )}
          {item.productStatus === "SOLD" && (
            <>
              <TouchableOpacity
                onPress={() =>
                  handleStatusChange(item._id, ProductStatus.ACTIVE)
                }
                className="bg-green-50 p-2 rounded-lg"
              >
                <Ionicons name="refresh" size={18} color="#16A34A" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleStatusChange(item._id, ProductStatus.DELETE)
                }
                className="bg-red-50 p-2 rounded-lg"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </>
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
              {products.length} product{products.length !== 1 ? "s" : ""} total
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
          onPress={() => router.push("/(vendor)/(tabs)/fridge" as any)}
          className="flex-1 flex-row items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl"
        >
          <MaterialCommunityIcons
            name="fridge-outline"
            size={20}
            color="#3B82F6"
          />
          <Text className="font-JakartaSemiBold text-sm text-gray-700">
            Cold Storage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(vendor)/(tabs)/orders" as any)}
          className="flex-1 flex-row items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl"
        >
          <Ionicons name="receipt-outline" size={20} color="#E9AB18" />
          <Text className="font-JakartaSemiBold text-sm text-gray-700">
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

      {/* Send to Fridge Modal */}
      <Modal visible={!!fridgeModal} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center px-8">
          <View className="bg-white rounded-3xl p-6">
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialCommunityIcons
                name="fridge-outline"
                size={22}
                color="#2D4D23"
              />
              <Text className="text-lg font-JakartaExtraBold text-[#2D4D23]">
                Send to Fridge
              </Text>
            </View>
            <Text className="font-Jakarta text-gray-500 mb-4">
              How many "{fridgeModal?.productName}" to store in cold storage?
            </Text>
            <TextInput
              className="bg-neutral-100 rounded-full p-4 font-JakartaBold text-center text-xl mb-4"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={fridgeAmount}
              onChangeText={setFridgeAmount}
              autoFocus
            />
            <Text className="text-center text-xs text-gray-400 font-Jakarta mb-4">
              If this product already exists in your fridge, the stock will be
              added automatically.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setFridgeModal(null);
                  setFridgeAmount("");
                }}
                className="flex-1 py-3 rounded-full border border-gray-200 items-center"
              >
                <Text className="font-JakartaSemiBold text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSendToFridge}
                className="flex-1 py-3 rounded-full bg-[#2D4D23] items-center"
              >
                <Text className="font-JakartaSemiBold text-white">
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
