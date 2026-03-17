import { useAdminMembers } from "@/hooks/admin/useAdminMembers";
import { MemberStatus, MemberType } from "@/libs/enums/member.enum";
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

const TYPE_FILTERS = ["ALL", ...Object.values(MemberType)] as const;
const STATUS_OPTIONS = Object.values(MemberStatus);

export default function AdminMembers() {
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { members, total, loading, refetch, updateMemberByAdmin } =
    useAdminMembers({
      page,
      limit: 20,
      search: {
        ...(typeFilter ? { memberType: typeFilter } : {}),
      },
    });

  const handleStatusUpdate = (memberId: string, currentStatus: string) => {
    const otherStatuses = STATUS_OPTIONS.filter((s) => s !== currentStatus);
    Alert.alert("Change Status", `Current: ${currentStatus}`, [
      ...otherStatuses.map((status) => ({
        text: status,
        onPress: async () => {
          try {
            await updateMemberByAdmin({
              _id: memberId,
              memberStatus: status,
            });
            Toast.show({ type: "success", text1: `Status changed to ${status}` });
            refetch();
          } catch (err: any) {
            sweetErrorAlert(err?.message || "Update failed");
          }
        },
      })),
      { text: "Cancel", style: "cancel" as const },
    ]);
  };

  const handleTypeUpdate = (memberId: string, currentType: string) => {
    const otherTypes = Object.values(MemberType).filter(
      (t) => t !== currentType
    );
    Alert.alert("Change Role", `Current: ${currentType}`, [
      ...otherTypes.map((type) => ({
        text: type,
        onPress: async () => {
          try {
            await updateMemberByAdmin({
              _id: memberId,
              memberType: type,
            });
            Toast.show({ type: "success", text1: `Role changed to ${type}` });
            refetch();
          } catch (err: any) {
            sweetErrorAlert(err?.message || "Update failed");
          }
        },
      })),
      { text: "Cancel", style: "cancel" as const },
    ]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ADMIN":
        return "bg-red-100 text-red-700";
      case "VENDOR":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "BLOCK":
        return "bg-red-100 text-red-700";
      case "DELETE":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderMember = ({ item }: { item: any }) => {
    const imageUri = item.memberImage
      ? `${process.env.EXPO_PUBLIC_API_URL}/${item.memberImage}`
      : null;

    return (
      <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
        <View className="flex-row items-center">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
              <Ionicons name="person" size={22} color="#999" />
            </View>
          )}
          <View className="flex-1 ml-3">
            <Text className="font-JakartaBold text-base">
              {item.memberNick}
            </Text>
            <Text className="font-Jakarta text-gray-500 text-sm">
              {item.memberPhone || "No phone"}
            </Text>
          </View>
        </View>

        {/* Badges and Actions */}
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleTypeUpdate(item._id, item.memberType)}
              className={`px-3 py-1 rounded-full ${getTypeColor(item.memberType)}`}
            >
              <Text className="text-xs font-JakartaSemiBold">
                {item.memberType}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleStatusUpdate(item._id, item.memberStatus)}
              className={`px-3 py-1 rounded-full ${getStatusColor(item.memberStatus)}`}
            >
              <Text className="text-xs font-JakartaSemiBold">
                {item.memberStatus}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-3">
            <Text className="text-xs text-gray-400">
              W:{item.memberWarnings}
            </Text>
            <Text className="text-xs text-gray-400">
              B:{item.memberBlocks}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row mt-3 gap-4">
          <Text className="text-xs text-gray-400 font-Jakarta">
            Products: {item.memberProducts}
          </Text>
          <Text className="text-xs text-gray-400 font-Jakarta">
            Articles: {item.memberArticles}
          </Text>
          <Text className="text-xs text-gray-400 font-Jakarta">
            Points: {item.memberPoints}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F2F5]" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-JakartaExtraBold text-[#1a1a2e]">
          Members
        </Text>
        <Text className="text-sm font-Jakarta text-gray-500 mt-1">
          {total} member{total !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Type Filter */}
      <View className="px-5 mb-3">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TYPE_FILTERS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected =
              item === "ALL" ? !typeFilter : typeFilter === item;
            return (
              <TouchableOpacity
                onPress={() =>
                  setTypeFilter(item === "ALL" ? undefined : item)
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
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Ionicons name="people-outline" size={60} color="#ccc" />
              <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
                No members found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
