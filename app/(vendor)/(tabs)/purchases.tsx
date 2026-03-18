import { usePresets } from "@/hooks/vendor/usePresets";
import { usePurchases, usePurchaseSummary } from "@/hooks/vendor/usePurchases";
import { getToken } from "@/libs/auth";
import { ProductCollection, ProductFrom } from "@/libs/enums/product.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const UNITS = ["box", "kg", "bag", "piece", "bundle", "crate"];
const COLLECTIONS = Object.values(ProductCollection).filter((c) => c !== "ALL");
const ORIGINS = Object.values(ProductFrom);

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function startOfDay(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toISOString();
}
function endOfDay(dateStr: string) {
  return new Date(dateStr + "T23:59:59.999").toISOString();
}

export default function Purchases() {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [viewMode, setViewMode] = useState<"daily" | "summary">("daily");

  // Purchase list for selected date
  const { purchases, total, loading, refetch, createPurchase } = usePurchases({
    page: 1,
    limit: 100,
    sort: "purchaseDate",
    direction: "DESC",
    search: {
      startDate: startOfDay(selectedDate),
      endDate: endOfDay(selectedDate),
      ...(searchProduct ? { productName: searchProduct } : {}),
    },
  });

  // Weekly summary
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const { summary, loading: summaryLoading } = usePurchaseSummary({
    startDate: weekStart.toISOString().split("T")[0] + "T00:00:00",
    endDate: weekEnd.toISOString().split("T")[0] + "T23:59:59.999",
  });

  // Presets (auto-created from purchases)
  const { presets, refetch: refetchPresets } = usePresets();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchPresets();
    }, [refetch, refetchPresets])
  );

  // Add form
  const [form, setForm] = useState({
    productName: "",
    productCollection: "",
    quantity: "",
    unit: "box",
    unitCost: "",
    memo: "",
    productPrice: "",
    productOriginPrice: "",
    productDesc: "",
    productOrigin: "",
  });
  const [formImages, setFormImages] = useState<
    { uri: string; fileName?: string; mimeType?: string }[]
  >([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setForm({
      productName: "",
      productCollection: "",
      quantity: "",
      unit: "box",
      unitCost: "",
      memo: "",
      productPrice: "",
      productOriginPrice: "",
      productDesc: "",
      productOrigin: "",
    });
    setFormImages([]);
    setUploadedPaths([]);
  };

  const fillFromPreset = (preset: any) => {
    setForm({
      productName: preset.productName,
      productCollection: preset.productCollection || "",
      quantity: preset.defaultQuantity ? String(preset.defaultQuantity) : "",
      unit: preset.unit || "box",
      unitCost: preset.defaultUnitCost ? String(preset.defaultUnitCost) : "",
      memo: "",
      productPrice: preset.productPrice ? String(preset.productPrice) : "",
      productOriginPrice: preset.productOriginPrice ? String(preset.productOriginPrice) : "",
      productDesc: preset.productDesc || "",
      productOrigin: preset.productOrigin || "",
    });
    if (preset.productImages?.length) {
      setUploadedPaths(preset.productImages);
      setFormImages(
        preset.productImages.map((p: string) => ({
          uri: `${process.env.EXPO_PUBLIC_API_URL}/${p}`,
        }))
      );
    } else {
      setFormImages([]);
      setUploadedPaths([]);
    }
  };

  const uploadImages = async (
    pickedImages: { uri: string; fileName?: string; mimeType?: string }[]
  ): Promise<string[]> => {
    const token = await getToken();
    const formData = new FormData();
    const fileMap: Record<string, string[]> = {};
    pickedImages.forEach((_, index) => {
      fileMap[String(index)] = [`variables.files.${index}`];
    });
    formData.append(
      "operations",
      JSON.stringify({
        query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { imagesUploader(files: $files, target: $target) }`,
        variables: { files: pickedImages.map(() => null), target: "product" },
      })
    );
    formData.append("map", JSON.stringify(fileMap));
    pickedImages.forEach((img, index) => {
      formData.append(String(index), {
        uri: img.uri,
        name: img.fileName || `product_${index}.jpg`,
        type: img.mimeType || "image/jpeg",
      } as any);
    });
    const response = await axios.post(
      process.env.EXPO_PUBLIC_API_GRAPHQL_URL!,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "apollo-require-preflight": "true",
        },
      }
    );
    return response.data.data.imagesUploader;
  };

  const pickFormImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map((a) => ({
        uri: a.uri,
        fileName: a.fileName || undefined,
        mimeType: a.mimeType || undefined,
      }));
      setFormImages((prev) => [...prev, ...newImages]);
      setUploading(true);
      try {
        const paths = await uploadImages(newImages);
        setUploadedPaths((prev) => [...prev, ...paths]);
      } catch (err) {
        console.log("Upload error:", err);
        setFormImages((prev) => prev.slice(0, prev.length - newImages.length));
      } finally {
        setUploading(false);
      }
    }
  };

  const removeFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedPaths((prev) => prev.filter((_, i) => i !== index));
  };

  /** Quick buy: select preset, fill form, and immediately show the modal */
  const quickBuyFromPreset = (preset: any) => {
    fillFromPreset(preset);
    setShowAddModal(true);
  };

  const handleAdd = async () => {
    if (!form.productName || !form.quantity) {
      await sweetErrorAlert("Enter product name and quantity");
      return;
    }
    try {
      await createPurchase({
        purchaseDate: selectedDate + "T09:00:00",
        productName: form.productName.trim(),
        productCollection: form.productCollection || undefined,
        quantity: Number(form.quantity),
        unit: form.unit,
        unitCost: Number(form.unitCost) || 0,
        memo: form.memo.trim() || undefined,
        // Product marketplace fields
        ...(Number(form.productPrice) > 0
          ? { productPrice: Number(form.productPrice) }
          : {}),
        ...(Number(form.productOriginPrice) > 0
          ? { productOriginPrice: Number(form.productOriginPrice) }
          : {}),
        ...(uploadedPaths.length > 0
          ? { productImages: uploadedPaths }
          : {}),
        ...(form.productDesc ? { productDesc: form.productDesc.trim() } : {}),
        ...(form.productOrigin ? { productOrigin: form.productOrigin } : {}),
      });
      Toast.show({
        type: "success",
        text1: `Recorded: ${form.quantity} ${form.unit} of ${form.productName}`,
        text2: "Fridge stock updated automatically",
      });
      setShowAddModal(false);
      resetForm();
      refetch();
      refetchPresets();
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Failed to record purchase");
    }
  };

  const dateLabel = new Date(selectedDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const dailyTotal = purchases.reduce(
    (sum: number, p: any) => sum + (p.totalCost || 0),
    0
  );

  const renderPurchase = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl mb-2 p-4 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-JakartaBold text-base">{item.productName}</Text>
          {item.productCollection ? (
            <View className="flex-row mt-1">
              <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-Jakarta text-gray-500">
                  {item.productCollection.replace(/_/g, " ")}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="font-JakartaExtraBold text-lg text-[#2D4D23]">
            {item.quantity} {item.unit}
          </Text>
          {item.unitCost > 0 && (
            <Text className="text-xs text-gray-500 font-Jakarta">
              ₩{item.unitCost.toLocaleString()} x {item.quantity} = ₩
              {item.totalCost.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
      {item.memo ? (
        <Text className="text-xs text-gray-400 font-Jakarta mt-2">
          {item.memo}
        </Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
              Daily Purchases
            </Text>
            <Text className="text-sm font-Jakarta text-gray-500 mt-1">
              Buy → auto-updates fridge
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-[#2D4D23] px-5 py-3 rounded-full flex-row items-center gap-2"
          >
            <Ionicons name="cart" size={18} color="white" />
            <Text className="text-white font-JakartaBold text-sm">Buy</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Buy from Presets */}
      {presets.length > 0 && (
        <View className="px-5 mb-2">
          <Text className="text-xs font-JakartaSemiBold text-gray-400 mb-2 uppercase tracking-wider">
            Quick Buy
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {presets.map((preset: any) => (
                <TouchableOpacity
                  key={preset._id}
                  onPress={() => quickBuyFromPreset(preset)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[120px]"
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-JakartaBold text-sm text-gray-800"
                    numberOfLines={1}
                  >
                    {preset.productName}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    {preset.defaultQuantity > 0 && (
                      <Text className="text-[10px] text-gray-500 font-Jakarta">
                        {preset.defaultQuantity} {preset.unit}
                      </Text>
                    )}
                    {preset.defaultUnitCost > 0 && (
                      <Text className="text-[10px] text-[#2D4D23] font-JakartaSemiBold">
                        ₩{preset.defaultUnitCost.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Date Picker */}
      <View className="px-5 mb-2">
        <TouchableOpacity
          onPress={() => setShowCalendar(!showCalendar)}
          className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar" size={20} color="#2D4D23" />
            <Text className="font-JakartaBold text-sm text-[#2D4D23]">
              {dateLabel}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {selectedDate !== todayStr() && (
              <TouchableOpacity
                onPress={() => setSelectedDate(todayStr())}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-xs font-JakartaSemiBold text-blue-500">
                  Today
                </Text>
              </TouchableOpacity>
            )}
            <Ionicons
              name={showCalendar ? "chevron-up" : "chevron-down"}
              size={18}
              color="#9CA3AF"
            />
          </View>
        </TouchableOpacity>

        {showCalendar && (
          <View className="mt-2 bg-white rounded-2xl overflow-hidden border border-gray-100">
            <Calendar
              current={selectedDate}
              onDayPress={(day: DateData) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#2D4D23",
                },
              }}
              theme={{
                todayTextColor: "#2D4D23",
                arrowColor: "#2D4D23",
                selectedDayBackgroundColor: "#2D4D23",
                textDayFontFamily: "Jakarta",
                textMonthFontFamily: "Jakarta-Bold",
                textDayHeaderFontFamily: "Jakarta-SemiBold",
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
            />
          </View>
        )}
      </View>

      {/* Search + View Mode Toggle */}
      <View className="px-5 mb-2 flex-row gap-2">
        <View className="flex-1 flex-row items-center bg-white rounded-full px-3 py-2 border border-gray-200">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 font-Jakarta text-sm"
            placeholder="Filter by product..."
            placeholderTextColor="#9CA3AF"
            value={searchProduct}
            onChangeText={setSearchProduct}
          />
          {searchProduct.length > 0 && (
            <TouchableOpacity onPress={() => setSearchProduct("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            setViewMode(viewMode === "daily" ? "summary" : "daily")
          }
          className={`px-4 py-2 rounded-full ${
            viewMode === "summary" ? "bg-[#2D4D23]" : "bg-white border border-gray-200"
          }`}
        >
          <Text
            className={`text-xs font-JakartaBold ${
              viewMode === "summary" ? "text-white" : "text-gray-600"
            }`}
          >
            {viewMode === "summary" ? "Weekly" : "Summary"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Daily Total Banner */}
      {viewMode === "daily" && dailyTotal > 0 && (
        <View className="mx-5 mb-2 bg-[#f0f7f0] rounded-xl px-4 py-3 flex-row justify-between items-center">
          <Text className="font-JakartaSemiBold text-sm text-gray-600">
            Day Total ({total} purchases)
          </Text>
          <Text className="font-JakartaExtraBold text-lg text-[#2D4D23]">
            ₩{dailyTotal.toLocaleString()}
          </Text>
        </View>
      )}

      {/* Content */}
      {viewMode === "daily" ? (
        loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2D4D23" />
          </View>
        ) : (
          <FlatList
            data={purchases}
            renderItem={renderPurchase}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            ListEmptyComponent={
              <View className="items-center mt-16">
                <Ionicons name="cart-outline" size={50} color="#ccc" />
                <Text className="font-JakartaBold text-base text-gray-400 mt-3">
                  No purchases on this date
                </Text>
                <Text className="font-Jakarta text-gray-400 text-sm mt-1">
                  Tap "Buy" to record a purchase
                </Text>
              </View>
            }
          />
        )
      ) : (
        /* Weekly Summary View */
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        >
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="font-JakartaBold text-base mb-1">
              Weekly Summary
            </Text>
            <Text className="text-xs text-gray-400 font-Jakarta mb-3">
              {weekStart.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
              {" ~ "}
              {weekEnd.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
            </Text>

            {summaryLoading ? (
              <ActivityIndicator size="small" color="#2D4D23" />
            ) : summary.items.length > 0 ? (
              <>
                {/* Table header */}
                <View className="flex-row bg-[#2D4D23] rounded-t-xl px-3 py-2">
                  <Text className="flex-1 text-xs font-JakartaBold text-white">
                    Product
                  </Text>
                  <Text className="w-20 text-xs font-JakartaBold text-white text-center">
                    Total Qty
                  </Text>
                  <Text className="w-24 text-xs font-JakartaBold text-white text-right">
                    Total Cost
                  </Text>
                </View>
                {summary.items.map((item: any, i: number) => (
                  <View
                    key={i}
                    className={`flex-row px-3 py-3 items-center ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <Text className="flex-1 text-sm font-JakartaSemiBold text-gray-800">
                      {item.productName}
                    </Text>
                    <Text className="w-20 text-sm font-Jakarta text-gray-600 text-center">
                      {item.totalQuantity} {item.unit}
                    </Text>
                    <Text className="w-24 text-sm font-JakartaBold text-gray-800 text-right">
                      ₩{item.totalCost.toLocaleString()}
                    </Text>
                  </View>
                ))}
                <View className="flex-row bg-[#f0f7f0] rounded-b-xl px-3 py-3">
                  <Text className="flex-1 font-JakartaBold text-gray-700">
                    GRAND TOTAL
                  </Text>
                  <Text className="font-JakartaExtraBold text-lg text-[#2D4D23]">
                    ₩{summary.grandTotal.toLocaleString()}
                  </Text>
                </View>
              </>
            ) : (
              <Text className="text-center text-gray-400 font-Jakarta py-4">
                No purchases this week
              </Text>
            )}
          </View>
        </ScrollView>
      )}

      {/* ===== ADD PURCHASE MODAL ===== */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-5 max-h-[90%]">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-xl font-JakartaExtraBold text-[#2D4D23]">
                    Record Purchase
                  </Text>
                  <Text className="text-xs font-Jakarta text-gray-500 mt-1">
                    For: {dateLabel}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled">
                {/* Preset Quick Select inside modal */}
                {presets.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-xs font-JakartaSemiBold text-gray-400 mb-2 uppercase tracking-wider">
                      Select from presets
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View className="flex-row gap-2">
                        {presets.map((preset: any) => (
                          <TouchableOpacity
                            key={preset._id}
                            onPress={() => fillFromPreset(preset)}
                            className={`px-3 py-2 rounded-full border ${
                              form.productName === preset.productName
                                ? "bg-[#2D4D23] border-[#2D4D23]"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <Text
                              className={`text-xs font-JakartaSemiBold ${
                                form.productName === preset.productName
                                  ? "text-white"
                                  : "text-gray-700"
                              }`}
                            >
                              {preset.productName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}

                <Text className="font-JakartaSemiBold mb-2">
                  Product Name *
                </Text>
                <TextInput
                  className="bg-neutral-100 rounded-full p-4 font-Jakarta mb-3"
                  placeholder="e.g. Red Apple, Korean Strawberry"
                  placeholderTextColor="#9CA3AF"
                  value={form.productName}
                  onChangeText={(v) => setForm({ ...form, productName: v })}
                />

                <Text className="font-JakartaSemiBold mb-2">Category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-3"
                >
                  <View className="flex-row gap-2">
                    {COLLECTIONS.map((col) => {
                      const isSelected = form.productCollection === col;
                      return (
                        <TouchableOpacity
                          key={col}
                          onPress={() =>
                            setForm({
                              ...form,
                              productCollection: isSelected ? "" : col,
                            })
                          }
                          className={`px-3 py-2 rounded-full ${
                            isSelected ? "bg-[#2D4D23]" : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-JakartaSemiBold ${
                              isSelected ? "text-white" : "text-gray-600"
                            }`}
                          >
                            {col.replace(/_/g, " ")}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                <View className="flex-row gap-2 mb-3">
                  <View className="flex-1">
                    <Text className="font-JakartaSemiBold mb-2">
                      Quantity *
                    </Text>
                    <TextInput
                      className="bg-neutral-100 rounded-full p-4 font-Jakarta"
                      placeholder="How many?"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.quantity}
                      onChangeText={(v) => setForm({ ...form, quantity: v })}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-JakartaSemiBold mb-2">
                      Unit Cost (₩)
                    </Text>
                    <TextInput
                      className="bg-neutral-100 rounded-full p-4 font-Jakarta"
                      placeholder="Price per unit"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.unitCost}
                      onChangeText={(v) => setForm({ ...form, unitCost: v })}
                    />
                  </View>
                </View>

                {/* Unit */}
                <Text className="font-JakartaSemiBold mb-2">Unit</Text>
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {UNITS.map((u) => (
                    <TouchableOpacity
                      key={u}
                      onPress={() => setForm({ ...form, unit: u })}
                      className={`px-3 py-2 rounded-full ${
                        form.unit === u ? "bg-[#E9AB18]" : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-JakartaSemiBold ${
                          form.unit === u ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {u}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Cost preview */}
                {Number(form.quantity) > 0 && Number(form.unitCost) > 0 && (
                  <View className="bg-[#f0f7f0] rounded-xl p-3 mb-3">
                    <Text className="text-center font-JakartaBold text-[#2D4D23]">
                      Total: ₩
                      {(
                        Number(form.quantity) * Number(form.unitCost)
                      ).toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* ===== PRODUCT LISTING SECTION ===== */}
                <View className="bg-blue-50 rounded-2xl p-3 mb-3">
                  <Text className="font-JakartaBold text-sm text-blue-700 mb-2">
                    List for Sale (optional)
                  </Text>

                  {/* Images */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2 mb-2">
                      {formImages.map((img, index) => (
                        <View key={index} className="relative">
                          <Image
                            source={{ uri: img.uri }}
                            className="w-16 h-16 rounded-lg"
                            resizeMode="cover"
                          />
                          {!uploading && (
                            <TouchableOpacity
                              onPress={() => removeFormImage(index)}
                              className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                            >
                              <Ionicons name="close" size={10} color="white" />
                            </TouchableOpacity>
                          )}
                          {uploading && index >= uploadedPaths.length && (
                            <View className="absolute inset-0 bg-black/40 rounded-lg items-center justify-center">
                              <ActivityIndicator size="small" color="white" />
                            </View>
                          )}
                        </View>
                      ))}
                      <TouchableOpacity
                        onPress={pickFormImages}
                        disabled={uploading}
                        className="w-16 h-16 rounded-lg bg-white border border-dashed border-gray-300 items-center justify-center"
                      >
                        <Ionicons name="camera" size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </ScrollView>

                  <View className="flex-row gap-2 mb-2">
                    <TextInput
                      className="bg-white rounded-full p-3 font-Jakarta text-sm flex-1"
                      placeholder="Sell price (₩)"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.productPrice}
                      onChangeText={(v) => setForm({ ...form, productPrice: v })}
                    />
                    <TextInput
                      className="bg-white rounded-full p-3 font-Jakarta text-sm flex-1"
                      placeholder="Origin price (₩)"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.productOriginPrice}
                      onChangeText={(v) =>
                        setForm({ ...form, productOriginPrice: v })
                      }
                    />
                  </View>

                  {/* Origin */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                    <View className="flex-row gap-1">
                      {ORIGINS.map((o) => (
                        <TouchableOpacity
                          key={o}
                          onPress={() =>
                            setForm({
                              ...form,
                              productOrigin: form.productOrigin === o ? "" : o,
                            })
                          }
                          className={`px-2 py-1 rounded-full ${
                            form.productOrigin === o ? "bg-[#E9AB18]" : "bg-white"
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-JakartaSemiBold ${
                              form.productOrigin === o ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {o}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>

                  <TextInput
                    className="bg-white rounded-2xl p-3 font-Jakarta text-sm"
                    placeholder="Product description"
                    placeholderTextColor="#9CA3AF"
                    value={form.productDesc}
                    onChangeText={(v) => setForm({ ...form, productDesc: v })}
                    multiline
                  />
                </View>

                <Text className="font-JakartaSemiBold mb-2">Memo</Text>
                <TextInput
                  className="bg-neutral-100 rounded-2xl p-4 font-Jakarta mb-4"
                  placeholder="Optional note..."
                  placeholderTextColor="#9CA3AF"
                  value={form.memo}
                  onChangeText={(v) => setForm({ ...form, memo: v })}
                />

                <TouchableOpacity
                  onPress={handleAdd}
                  className="bg-[#2D4D23] py-4 rounded-full items-center mb-6 flex-row justify-center gap-2"
                >
                  <Ionicons name="cart" size={18} color="white" />
                  <Text className="text-white font-JakartaBold text-base">
                    Record Purchase
                  </Text>
                </TouchableOpacity>

                <Text className="text-center text-xs text-gray-400 font-Jakarta mb-4">
                  This will also add {form.quantity || "0"} {form.unit} of "
                  {form.productName || "..."}" to your fridge stock
                </Text>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}
