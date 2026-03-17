import { userVar } from "@/apollo/store";
import { useAdminMembers } from "@/hooks/admin/useAdminMembers";
import { useAdminOrders } from "@/hooks/admin/useAdminOrders";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { logOut } from "@/libs/auth";
import { useReactiveVar } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <View className="bg-white rounded-2xl p-5 flex-1 min-w-[45%] shadow-sm">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: color + "20" }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-2xl font-JakartaExtraBold">{value}</Text>
      <Text className="text-sm font-Jakarta text-gray-500 mt-1">{title}</Text>
    </View>
  );
}

export default function AdminDashboard() {
  const user = useReactiveVar(userVar);

  const { total: totalMembers } = useAdminMembers({
    page: 1,
    limit: 1,
    search: {},
  });

  const { total: totalProducts } = useAdminProducts({
    page: 1,
    limit: 1,
    search: {},
  });

  const { total: totalOrders } = useAdminOrders({
    page: 1,
    limit: 1,
    search: {},
  });

  const { total: activeProducts } = useAdminProducts({
    page: 1,
    limit: 1,
    search: { productStatus: "ACTIVE" },
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F0F2F5]" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm font-Jakarta text-gray-500">
                Welcome back,
              </Text>
              <Text className="text-2xl font-JakartaExtraBold text-[#1a1a2e]">
                {user.memberNick}
              </Text>
            </View>
            <TouchableOpacity
              onPress={logOut}
              className="bg-white p-3 rounded-full shadow-sm"
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
          <View className="bg-[#1a1a2e] rounded-2xl p-5 mt-4">
            <Text className="text-white font-Jakarta text-sm opacity-70">
              Admin Panel
            </Text>
            <Text className="text-white font-JakartaExtraBold text-xl mt-1">
              ShijangMe Management
            </Text>
            <Text className="text-white font-Jakarta text-sm opacity-70 mt-2">
              Manage members, products, orders, and content
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-5">
          <Text className="text-lg font-JakartaBold mb-3">Overview</Text>
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              title="Total Members"
              value={totalMembers}
              icon="people"
              color="#3B82F6"
            />
            <StatCard
              title="Total Products"
              value={totalProducts}
              icon="cube"
              color="#8B5CF6"
            />
            <StatCard
              title="Active Products"
              value={activeProducts}
              icon="checkmark-circle"
              color="#16A34A"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders}
              icon="receipt"
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-JakartaBold mb-3">Quick Actions</Text>
          <View className="gap-3">
            {[
              {
                label: "View All Members",
                icon: "people-outline" as const,
                desc: "Manage user accounts and roles",
              },
              {
                label: "Review Products",
                icon: "cube-outline" as const,
                desc: "Approve, edit, or remove products",
              },
              {
                label: "Manage Orders",
                icon: "receipt-outline" as const,
                desc: "Track and update order statuses",
              },
              {
                label: "Content Management",
                icon: "newspaper-outline" as const,
                desc: "Articles, notices, and comments",
              },
            ].map((action) => (
              <View
                key={action.label}
                className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
              >
                <View className="bg-[#1a1a2e] w-10 h-10 rounded-full items-center justify-center">
                  <Ionicons name={action.icon} size={20} color="white" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="font-JakartaBold text-base">
                    {action.label}
                  </Text>
                  <Text className="font-Jakarta text-gray-500 text-sm">
                    {action.desc}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
