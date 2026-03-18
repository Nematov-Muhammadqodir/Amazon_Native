import { userVar } from "@/apollo/store";
import { GET_VENDORS } from "@/apollo/user/query";
import { useReactiveVar } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BrowseVendors() {
  const user = useReactiveVar(userVar);
  const [search, setSearch] = useState("");

  const { data, loading } = useQuery<any>(GET_VENDORS, {
    variables: {
      input: {
        page: 1,
        limit: 50,
        search: {
          ...(search ? { text: search } : {}),
        },
      },
    },
    fetchPolicy: "network-only",
  });

  const vendors = (data?.getVendors?.list ?? []).filter(
    (v: any) => v._id !== user._id
  );

  const renderVendor = ({ item }: { item: any }) => {
    const imageUri = item.memberImage
      ? `${process.env.EXPO_PUBLIC_API_URL}/${item.memberImage}`
      : null;

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(vendor)/(tabs)/vendor-fridge" as any,
            params: { vendorId: item._id, vendorName: item.memberNick },
          })
        }
        className="bg-white rounded-2xl mb-3 p-4 flex-row items-center shadow-sm"
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-14 h-14 rounded-full"
          />
        ) : (
          <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
            <Ionicons name="person" size={24} color="#999" />
          </View>
        )}
        <View className="flex-1 ml-4">
          <Text className="font-JakartaBold text-base">
            {item.memberNick}
          </Text>
          {item.memberAddress ? (
            <Text className="text-xs text-gray-500 font-Jakarta mt-0.5">
              {item.memberAddress}
            </Text>
          ) : null}
          <Text className="text-xs text-gray-400 font-Jakarta mt-0.5">
            {item.memberProducts} products
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-JakartaExtraBold text-[#1a1a2e]">
              Vendors
            </Text>
            <Text className="text-sm font-Jakarta text-gray-500">
              Browse other vendors' stock to borrow
            </Text>
          </View>
        </View>
      </View>

      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 border border-gray-200">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 font-Jakarta text-[15px]"
            placeholder="Search vendors..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1a1a2e" className="mt-10" />
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderVendor}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center mt-16">
              <Ionicons name="people-outline" size={50} color="#ccc" />
              <Text className="font-JakartaBold text-gray-400 mt-3">
                No vendors found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
