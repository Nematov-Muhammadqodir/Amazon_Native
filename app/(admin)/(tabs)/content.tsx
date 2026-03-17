import { useAdminArticles } from "@/hooks/admin/useAdminArticles";
import { useAdminNotices } from "@/hooks/admin/useAdminNotices";
import {
  BoardArticleStatus,
  BoardArticleCategory,
} from "@/libs/enums/board-article.enum";
import { NoticeCategory, NoticeStatus } from "@/libs/enums/notice.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type Tab = "articles" | "notices";

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");

  return (
    <SafeAreaView className="flex-1 bg-[#F0F2F5]" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-JakartaExtraBold text-[#1a1a2e]">
          Content
        </Text>
      </View>

      {/* Tab Switcher */}
      <View className="px-5 mb-3 flex-row gap-2">
        <TouchableOpacity
          onPress={() => setActiveTab("articles")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "articles" ? "bg-[#1a1a2e]" : "bg-white"
          }`}
        >
          <Text
            className={`text-center font-JakartaSemiBold ${
              activeTab === "articles" ? "text-white" : "text-gray-600"
            }`}
          >
            Articles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("notices")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "notices" ? "bg-[#1a1a2e]" : "bg-white"
          }`}
        >
          <Text
            className={`text-center font-JakartaSemiBold ${
              activeTab === "notices" ? "text-white" : "text-gray-600"
            }`}
          >
            Notices
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "articles" ? <ArticlesSection /> : <NoticesSection />}
    </SafeAreaView>
  );
}

/* ===== ARTICLES SECTION ===== */
function ArticlesSection() {
  const [page, setPage] = useState(1);
  const { articles, total, loading, refetch, updateArticleByAdmin, removeArticleByAdmin } =
    useAdminArticles({
      page,
      limit: 20,
      search: {},
    });

  const handleRemove = (articleId: string, title: string) => {
    Alert.alert("Delete Article", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeArticleByAdmin(articleId);
            Toast.show({ type: "success", text1: "Article removed" });
            refetch();
          } catch (err: any) {
            sweetErrorAlert(err?.message || "Remove failed");
          }
        },
      },
    ]);
  };

  const handleStatusToggle = async (articleId: string, currentStatus: string) => {
    const newStatus =
      currentStatus === BoardArticleStatus.ACTIVE
        ? BoardArticleStatus.DELETE
        : BoardArticleStatus.ACTIVE;
    try {
      await updateArticleByAdmin({ _id: articleId, articleStatus: newStatus });
      Toast.show({ type: "success", text1: `Article ${newStatus.toLowerCase()}` });
      refetch();
    } catch (err: any) {
      sweetErrorAlert(err?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1a1a2e" />
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      ListHeaderComponent={
        <Text className="text-sm font-Jakarta text-gray-500 mb-3">
          {total} article{total !== 1 ? "s" : ""}
        </Text>
      }
      renderItem={({ item }) => (
        <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row gap-2 items-center mb-1">
                <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                  <Text className="text-xs font-JakartaSemiBold text-blue-700">
                    {item.articleCategory}
                  </Text>
                </View>
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    item.articleStatus === "ACTIVE"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-JakartaSemiBold ${
                      item.articleStatus === "ACTIVE"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {item.articleStatus}
                  </Text>
                </View>
              </View>
              <Text className="font-JakartaBold text-base" numberOfLines={1}>
                {item.articleTitle}
              </Text>
              <Text className="font-Jakarta text-gray-500 text-sm mt-1" numberOfLines={2}>
                {item.articleContent}
              </Text>
              <Text className="font-Jakarta text-gray-400 text-xs mt-2">
                By: {item.memberData?.memberNick || "Unknown"} |{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-col gap-2 ml-2">
              <TouchableOpacity
                onPress={() => handleStatusToggle(item._id, item.articleStatus)}
                className="p-2"
              >
                <Ionicons
                  name={item.articleStatus === "ACTIVE" ? "eye-off" : "eye"}
                  size={18}
                  color="#666"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemove(item._id, item.articleTitle)}
                className="p-2"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View className="items-center mt-20">
          <Ionicons name="document-text-outline" size={60} color="#ccc" />
          <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
            No articles found
          </Text>
        </View>
      }
    />
  );
}

/* ===== NOTICES SECTION ===== */
function NoticesSection() {
  const { notices, loading, refetch, createNotice, updateNotice } =
    useAdminNotices();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    noticeTitle: "",
    noticeContent: "",
    noticeCategory: NoticeCategory.FAQ,
    noticeStatus: NoticeStatus.ACTIVE,
  });

  const handleCreate = async () => {
    if (!form.noticeTitle || !form.noticeContent) {
      sweetErrorAlert("Please fill in title and content");
      return;
    }
    try {
      await createNotice(form);
      Toast.show({ type: "success", text1: "Notice created" });
      setShowForm(false);
      setForm({
        noticeTitle: "",
        noticeContent: "",
        noticeCategory: NoticeCategory.FAQ,
        noticeStatus: NoticeStatus.ACTIVE,
      });
      refetch();
    } catch (err: any) {
      sweetErrorAlert(err?.message || "Create failed");
    }
  };

  const handleStatusToggle = async (noticeId: string, currentStatus: string) => {
    const newStatus =
      currentStatus === NoticeStatus.ACTIVE
        ? NoticeStatus.HOLD
        : NoticeStatus.ACTIVE;
    try {
      await updateNotice({ _id: noticeId, noticeStatus: newStatus });
      Toast.show({ type: "success", text1: `Notice ${newStatus.toLowerCase()}` });
      refetch();
    } catch (err: any) {
      sweetErrorAlert(err?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1a1a2e" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
      {/* Create Button */}
      <TouchableOpacity
        onPress={() => setShowForm(!showForm)}
        className="bg-[#1a1a2e] rounded-xl py-3 mb-4 flex-row items-center justify-center gap-2"
      >
        <Ionicons
          name={showForm ? "close" : "add"}
          size={20}
          color="white"
        />
        <Text className="text-white font-JakartaSemiBold">
          {showForm ? "Cancel" : "Create Notice"}
        </Text>
      </TouchableOpacity>

      {/* Create Form */}
      {showForm && (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <TextInput
            className="border border-gray-200 rounded-xl p-3 mb-3 font-Jakarta"
            placeholder="Notice title"
            value={form.noticeTitle}
            onChangeText={(v) => setForm({ ...form, noticeTitle: v })}
          />
          <TextInput
            className="border border-gray-200 rounded-xl p-3 mb-3 font-Jakarta"
            placeholder="Notice content"
            value={form.noticeContent}
            onChangeText={(v) => setForm({ ...form, noticeContent: v })}
            multiline
            numberOfLines={3}
          />
          <View className="flex-row gap-2 mb-3">
            {Object.values(NoticeCategory).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setForm({ ...form, noticeCategory: cat })}
                className={`px-3 py-2 rounded-full ${
                  form.noticeCategory === cat
                    ? "bg-[#1a1a2e]"
                    : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-xs font-JakartaSemiBold ${
                    form.noticeCategory === cat
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={handleCreate}
            className="bg-green-600 rounded-xl py-3"
          >
            <Text className="text-white font-JakartaBold text-center">
              Publish Notice
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notices List */}
      <Text className="text-sm font-Jakarta text-gray-500 mb-3">
        {notices.length} notice{notices.length !== 1 ? "s" : ""}
      </Text>
      {notices.map((item: any) => (
        <View key={item._id} className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row gap-2 items-center mb-1">
                <View className="bg-indigo-100 px-2 py-0.5 rounded-full">
                  <Text className="text-xs font-JakartaSemiBold text-indigo-700">
                    {item.noticeCategory}
                  </Text>
                </View>
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    item.noticeStatus === "ACTIVE"
                      ? "bg-green-100"
                      : item.noticeStatus === "HOLD"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-JakartaSemiBold ${
                      item.noticeStatus === "ACTIVE"
                        ? "text-green-700"
                        : item.noticeStatus === "HOLD"
                          ? "text-yellow-700"
                          : "text-red-700"
                    }`}
                  >
                    {item.noticeStatus}
                  </Text>
                </View>
              </View>
              <Text className="font-JakartaBold text-base">
                {item.noticeTitle}
              </Text>
              <Text className="font-Jakarta text-gray-500 text-sm mt-1">
                {item.noticeContent}
              </Text>
              <Text className="font-Jakarta text-gray-400 text-xs mt-2">
                {new Date(item.createdAt).toLocaleDateString()}
                {item.noticeFor && ` | For: ${item.noticeFor}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleStatusToggle(item._id, item.noticeStatus)}
              className="p-2"
            >
              <Ionicons
                name={
                  item.noticeStatus === "ACTIVE"
                    ? "pause-circle"
                    : "play-circle"
                }
                size={22}
                color={item.noticeStatus === "ACTIVE" ? "#F59E0B" : "#16A34A"}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {notices.length === 0 && (
        <View className="items-center mt-10">
          <Ionicons name="megaphone-outline" size={60} color="#ccc" />
          <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
            No notices yet
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
