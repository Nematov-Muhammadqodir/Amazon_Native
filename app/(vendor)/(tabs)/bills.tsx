import { userVar } from "@/apollo/store";
import { useBills } from "@/hooks/vendor/useBills";
import { useFridge } from "@/hooks/vendor/useFridge";
import { generateBillHtml } from "@/libs/utils/generateBillPdf";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

interface BillItemForm {
  productName: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  showDropdown: boolean;
}

const UNITS = ["kg", "box", "bag", "piece", "bundle", "crate"];

type DateFilter = "ALL" | "TODAY" | "YESTERDAY" | "THIS_WEEK" | "THIS_MONTH";

function getDateRange(filter: DateFilter): {
  startDate?: string;
  endDate?: string;
} {
  const now = new Date();
  const startOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  const endOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(23, 59, 59, 999);
    return copy;
  };

  switch (filter) {
    case "TODAY":
      return {
        startDate: startOfDay(now).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    case "YESTERDAY": {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: startOfDay(yesterday).toISOString(),
        endDate: endOfDay(yesterday).toISOString(),
      };
    }
    case "THIS_WEEK": {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return {
        startDate: startOfDay(weekStart).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    }
    case "THIS_MONTH": {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        startDate: startOfDay(monthStart).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    }
    default:
      return {};
  }
}

const DATE_FILTERS: { key: DateFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "TODAY", label: "Today" },
  { key: "YESTERDAY", label: "Yesterday" },
  { key: "THIS_WEEK", label: "This Week" },
  { key: "THIS_MONTH", label: "This Month" },
];

export default function Bills() {
  const user = useReactiveVar(userVar);
  const [showCreate, setShowCreate] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [detailBill, setDetailBill] = useState<any>(null);

  // Calendar date takes priority over chip filter
  const dateRange = selectedDate
    ? {
        startDate: new Date(selectedDate + "T00:00:00").toISOString(),
        endDate: new Date(selectedDate + "T23:59:59.999").toISOString(),
      }
    : getDateRange(dateFilter);

  const { bills, total, loading, refetch, createBill, deleteBill } = useBills({
    page: 1,
    limit: 100,
    sort: "createdAt",
    direction: "DESC",
    search: {
      ...(searchText ? { customerName: searchText } : {}),
      ...(dateRange.startDate ? { startDate: dateRange.startDate } : {}),
      ...(dateRange.endDate ? { endDate: dateRange.endDate } : {}),
    },
  });

  // Fetch fridge items for the product picker
  const { fridgeItems: activeProducts, refetch: refetchFridge } = useFridge({
    page: 1,
    limit: 100,
    sort: "productName",
    direction: "ASC",
    search: { itemStatus: "ACTIVE" },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Create bill form state
  const [customerName, setCustomerName] = useState("");
  const [memo, setMemo] = useState("");
  const [items, setItems] = useState<BillItemForm[]>([
    {
      productName: "",
      quantity: "",
      unit: "kg",
      unitPrice: "",
      showDropdown: false,
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        productName: "",
        quantity: "",
        unit: "kg",
        unitPrice: "",
        showDropdown: false,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  };

  const resetForm = () => {
    setCustomerName("");
    setMemo("");
    setItems([
      {
        productName: "",
        quantity: "",
        unit: "kg",
        unitPrice: "",
        showDropdown: false,
      },
    ]);
  };

  /** Select a product from the dropdown — auto-fill name, show stock info */
  const selectProduct = (index: number, product: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      productName: product.productName,
      unit: product.unit || "kg",
      showDropdown: false,
    };
    setItems(updated);
  };

  /** Get filtered products based on what the vendor has typed */
  const getFilteredProducts = (query: string) => {
    if (!query) return activeProducts;
    return activeProducts.filter((p: any) =>
      p.productName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleCreate = async () => {
    if (!customerName.trim()) {
      await sweetErrorAlert("Enter customer name");
      return;
    }

    const validItems = items.filter(
      (i) => i.productName && Number(i.quantity) > 0 && Number(i.unitPrice) > 0
    );

    if (validItems.length === 0) {
      await sweetErrorAlert("Add at least one product with quantity and price");
      return;
    }

    try {
      const billItems = validItems.map((i) => ({
        productName: i.productName,
        quantity: Number(i.quantity),
        unit: i.unit || "kg",
        unitPrice: Number(i.unitPrice),
        totalPrice: Number(i.quantity) * Number(i.unitPrice),
      }));

      const result = await createBill({
        customerName: customerName.trim(),
        items: billItems,
        totalAmount: calculateTotal(),
        memo: memo.trim() || undefined,
      });

      Toast.show({ type: "success", text1: "Bill created!" });
      setShowCreate(false);
      resetForm();
      refetch();
      refetchFridge();

      // Offer to share immediately
      Alert.alert("Bill Saved", "Share this bill now?", [
        { text: "Later", style: "cancel" },
        { text: "Share as PDF", onPress: () => shareBillAsPdf(result) },
      ]);
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Failed to create bill");
    }
  };

  const shareBillAsPdf = async (bill: any) => {
    try {
      const html = generateBillHtml(bill);
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `Bill - ${bill.customerName}`,
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Sharing not available on this device");
      }
    } catch (err) {
      console.log("Share error:", err);
      await sweetErrorAlert("Failed to generate PDF");
    }
  };

  const handleDelete = (billId: string) => {
    Alert.alert("Delete Bill", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBill(billId);
            Toast.show({ type: "success", text1: "Bill deleted" });
            refetch();
          } catch (err: any) {
            sweetErrorAlert(err?.message || "Delete failed");
          }
        },
      },
    ]);
  };

  // Group bills by date
  const groupedBills = bills.reduce((groups: any, bill: any) => {
    const date = new Date(bill.createdAt).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(bill);
    return groups;
  }, {});

  const sections = Object.keys(groupedBills).map((date) => ({
    title: date,
    data: groupedBills[date],
  }));

  const renderBill = ({ item }: { item: any }) => {
    const time = new Date(item.createdAt).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setDetailBill(item)}
        style={{ maxHeight: 150 }}
        className="bg-white rounded-2xl mb-3 p-4 shadow-sm overflow-hidden"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center gap-2">
            <Ionicons name="person" size={16} color="#2D4D23" />
            <Text className="font-JakartaBold text-base" numberOfLines={1}>
              {item.customerName}
            </Text>
          </View>
          <Text className="font-JakartaExtraBold text-lg text-[#2D4D23]">
            ₩{item.totalAmount.toLocaleString()}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-gray-400 font-Jakarta">
            {time} | {item.items.length} item
            {item.items.length !== 1 ? "s" : ""}
          </Text>
          <Text className="text-xs text-[#2D4D23] font-JakartaSemiBold">
            Tap for details
          </Text>
        </View>

        {/* Items preview - first 2 only */}
        <View className="mt-2 bg-gray-50 rounded-xl p-2">
          {item.items.slice(0, 2).map((prod: any, i: number) => (
            <View key={i} className="flex-row justify-between py-0.5">
              <Text
                className="text-xs font-Jakarta text-gray-600"
                numberOfLines={1}
              >
                {prod.productName}
              </Text>
              <Text className="text-xs font-JakartaSemiBold text-gray-700">
                {prod.quantity}
                {prod.unit} x ₩{prod.unitPrice.toLocaleString()}
              </Text>
            </View>
          ))}
          {item.items.length > 2 && (
            <Text className="text-[10px] text-gray-400 font-Jakarta mt-0.5">
              +{item.items.length - 2} more...
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
              Bills
            </Text>
            <Text className="text-sm font-Jakarta text-gray-500 mt-1">
              {total} bill{total !== 1 ? "s" : ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            className="bg-[#2D4D23] px-5 py-3 rounded-full flex-row items-center gap-2"
          >
            <Ionicons name="receipt-outline" size={18} color="white" />
            <Text className="text-white font-JakartaBold text-sm">
              New Bill
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 border border-gray-200">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 font-Jakarta text-[15px]"
            placeholder="Search by customer name..."
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

      {/* Calendar Toggle + Calendar */}
      <View className="px-5 mb-3">
        <TouchableOpacity
          onPress={() => setShowCalendar(!showCalendar)}
          className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={20} color="#2D4D23" />
            <Text className="font-JakartaSemiBold text-sm text-gray-700">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Pick a date"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {selectedDate && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDate(null);
                  setDateFilter("ALL");
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
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
              onDayPress={(day: DateData) => {
                setSelectedDate(day.dateString);
                setDateFilter("ALL");
                setShowCalendar(false);
              }}
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: "#2D4D23",
                      },
                    }
                  : {}
              }
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

      {/* Date Filter */}
      <View className="px-5 mb-3">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DATE_FILTERS}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            const isSelected = !selectedDate && dateFilter === item.key;
            return (
              <TouchableOpacity
                onPress={() => {
                  setDateFilter(item.key);
                  setSelectedDate(null);
                }}
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
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Bills grouped by date */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2D4D23" />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderItem={renderBill}
          renderSectionHeader={({ section: { title } }) => (
            <View className="px-5 py-2 bg-gray-50">
              <Text className="font-JakartaBold text-sm text-gray-500">
                {title}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text className="font-JakartaBold text-lg text-gray-400 mt-4">
                No bills yet
              </Text>
              <Text className="font-Jakarta text-gray-400 mt-1">
                Create your first bill
              </Text>
            </View>
          }
        />
      )}

      {/* ===== CREATE BILL MODAL ===== */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-5 max-h-[95%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-JakartaExtraBold text-[#2D4D23]">
                  Create Bill
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCreate(false);
                    resetForm();
                  }}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Customer Name */}
                <Text className="font-JakartaSemiBold mb-2">
                  Customer Name *
                </Text>
                <TextInput
                  className="bg-neutral-100 rounded-full p-4 font-Jakarta mb-4"
                  placeholder="Enter customer name"
                  placeholderTextColor="#9CA3AF"
                  value={customerName}
                  onChangeText={setCustomerName}
                />

                {/* Items */}
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-JakartaSemiBold">Products *</Text>
                  <TouchableOpacity
                    onPress={addItem}
                    className="flex-row items-center gap-1"
                  >
                    <Ionicons name="add-circle" size={20} color="#2D4D23" />
                    <Text className="text-sm font-JakartaSemiBold text-[#2D4D23]">
                      Add Row
                    </Text>
                  </TouchableOpacity>
                </View>

                {items.map((item, index) => (
                  <View key={index} className="bg-gray-50 rounded-2xl p-3 mb-3">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-xs font-JakartaBold text-gray-500">
                        #{index + 1}
                      </Text>
                      {items.length > 1 && (
                        <TouchableOpacity onPress={() => removeItem(index)}>
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Product name with dropdown */}
                    <View className="mb-2">
                      <View className="flex-row items-center bg-white rounded-full pr-2">
                        <TextInput
                          className="flex-1 p-3 font-Jakarta text-sm"
                          placeholder="Search or select product"
                          placeholderTextColor="#9CA3AF"
                          value={item.productName}
                          onChangeText={(v) => {
                            const updated = [...items];
                            updated[index] = {
                              ...updated[index],
                              productName: v,
                              showDropdown: true,
                            };
                            setItems(updated);
                          }}
                          onFocus={() => {
                            const updated = [...items];
                            updated[index] = {
                              ...updated[index],
                              showDropdown: true,
                            };
                            setItems(updated);
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            const updated = [...items];
                            updated[index] = {
                              ...updated[index],
                              showDropdown: !updated[index].showDropdown,
                            };
                            setItems(updated);
                          }}
                          className="p-2"
                        >
                          <Ionicons
                            name={
                              item.showDropdown ? "chevron-up" : "chevron-down"
                            }
                            size={18}
                            color="#9CA3AF"
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Dropdown list */}
                      {item.showDropdown && activeProducts.length > 0 && (
                        <View className="bg-white rounded-xl border border-gray-200 mt-1 max-h-[160px]">
                          <ScrollView
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                          >
                            {getFilteredProducts(item.productName).map(
                              (product: any) => (
                                <TouchableOpacity
                                  key={product._id}
                                  onPress={() => selectProduct(index, product)}
                                  className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                                >
                                  <Text
                                    className="font-JakartaSemiBold text-sm text-gray-800 flex-1"
                                    numberOfLines={1}
                                  >
                                    {product.productName}
                                  </Text>
                                  <Text className="font-JakartaBold text-xs text-[#2D4D23] ml-2">
                                    {product.currentStock} {product.unit}
                                  </Text>
                                </TouchableOpacity>
                              )
                            )}
                            {getFilteredProducts(item.productName).length ===
                              0 && (
                              <View className="px-4 py-3">
                                <Text className="text-xs text-gray-400 font-Jakarta">
                                  No matching products — type to add manually
                                </Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    <View className="flex-row gap-2 mb-2">
                      <TextInput
                        className="bg-white rounded-full p-3 font-Jakarta text-sm flex-1"
                        placeholder="Qty"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        value={item.quantity}
                        onChangeText={(v) => updateItem(index, "quantity", v)}
                      />
                      <TextInput
                        className="bg-white rounded-full p-3 font-Jakarta text-sm flex-1"
                        placeholder="Unit price (₩)"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        value={item.unitPrice}
                        onChangeText={(v) => updateItem(index, "unitPrice", v)}
                      />
                    </View>

                    {/* Unit selector */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View className="flex-row gap-1">
                        {UNITS.map((u) => (
                          <TouchableOpacity
                            key={u}
                            onPress={() => updateItem(index, "unit", u)}
                            className={`px-3 py-1 rounded-full ${
                              item.unit === u ? "bg-[#E9AB18]" : "bg-white"
                            }`}
                          >
                            <Text
                              className={`text-xs font-JakartaSemiBold ${
                                item.unit === u ? "text-white" : "text-gray-500"
                              }`}
                            >
                              {u}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>

                    {/* Line total */}
                    {Number(item.quantity) > 0 &&
                      Number(item.unitPrice) > 0 && (
                        <Text className="text-right text-sm font-JakartaBold text-[#2D4D23] mt-2">
                          = ₩
                          {(
                            Number(item.quantity) * Number(item.unitPrice)
                          ).toLocaleString()}
                        </Text>
                      )}
                  </View>
                ))}

                {/* Memo */}
                <Text className="font-JakartaSemiBold mb-2 mt-2">
                  Memo (optional)
                </Text>
                <TextInput
                  className="bg-neutral-100 rounded-2xl p-4 font-Jakarta mb-4"
                  placeholder="Any notes..."
                  placeholderTextColor="#9CA3AF"
                  value={memo}
                  onChangeText={setMemo}
                />

                {/* Total */}
                <View className="bg-[#f0f7f0] rounded-2xl p-4 mb-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-JakartaBold text-lg text-gray-700">
                      Total
                    </Text>
                    <Text className="font-JakartaExtraBold text-2xl text-[#2D4D23]">
                      ₩{calculateTotal().toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity
                  onPress={handleCreate}
                  className="bg-[#2D4D23] py-4 rounded-full items-center mb-6"
                >
                  <Text className="text-white font-JakartaBold text-base">
                    Save Bill
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ===== BILL DETAIL MODAL (from top) ===== */}
      <Modal
        visible={!!detailBill}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailBill(null)}
      >
        {detailBill && (
          <SafeAreaView className="flex-1 bg-white pt-5">
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 pt-4 pb-3 border-b border-gray-100">
              <Text className="text-xl font-JakartaExtraBold text-[#2D4D23]">
                Bill Details
              </Text>
              <TouchableOpacity onPress={() => setDetailBill(null)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
              {/* Customer & Vendor */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1 bg-gray-50 rounded-xl p-4">
                  <Text className="text-xs text-gray-400 font-Jakarta uppercase tracking-wider">
                    Customer
                  </Text>
                  <Text className="font-JakartaBold text-base mt-1">
                    {detailBill.customerName}
                  </Text>
                </View>
                <View className="flex-1 bg-gray-50 rounded-xl p-4">
                  <Text className="text-xs text-gray-400 font-Jakarta uppercase tracking-wider">
                    Vendor
                  </Text>
                  <Text className="font-JakartaBold text-base mt-1">
                    {detailBill.vendorName}
                  </Text>
                </View>
              </View>

              {/* Date */}
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-xs text-gray-400 font-Jakarta uppercase tracking-wider">
                  Date & Time
                </Text>
                <Text className="font-JakartaSemiBold text-sm mt-1">
                  {new Date(detailBill.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}{" "}
                  {new Date(detailBill.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              {/* Items table */}
              <Text className="font-JakartaBold text-base mb-2">
                Items ({detailBill.items.length})
              </Text>
              <View className="bg-gray-50 rounded-xl overflow-hidden mb-4">
                {/* Table header */}
                <View className="flex-row bg-[#2D4D23] px-4 py-3">
                  <Text className="flex-1 text-xs font-JakartaBold text-white">
                    Product
                  </Text>
                  <Text className="w-16 text-xs font-JakartaBold text-white text-center">
                    Qty
                  </Text>
                  <Text className="w-20 text-xs font-JakartaBold text-white text-right">
                    Price
                  </Text>
                  <Text className="w-24 text-xs font-JakartaBold text-white text-right">
                    Total
                  </Text>
                </View>

                {/* Table rows */}
                {detailBill.items.map((prod: any, i: number) => (
                  <View
                    key={i}
                    className={`flex-row px-4 py-3 items-center ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <Text
                      className="flex-1 text-sm font-JakartaSemiBold text-gray-800"
                      numberOfLines={2}
                    >
                      {prod.productName}
                    </Text>
                    <Text className="w-16 text-sm font-Jakarta text-gray-600 text-center">
                      {prod.quantity}
                      {prod.unit}
                    </Text>
                    <Text className="w-20 text-sm font-Jakarta text-gray-600 text-right">
                      ₩{prod.unitPrice.toLocaleString()}
                    </Text>
                    <Text className="w-24 text-sm font-JakartaBold text-gray-800 text-right">
                      ₩{prod.totalPrice.toLocaleString()}
                    </Text>
                  </View>
                ))}

                {/* Total row */}
                <View className="flex-row px-4 py-4 bg-[#f0f7f0] border-t border-gray-200">
                  <Text className="flex-1 font-JakartaBold text-base text-gray-700">
                    TOTAL
                  </Text>
                  <Text className="font-JakartaExtraBold text-xl text-[#2D4D23]">
                    ₩{detailBill.totalAmount.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Memo */}
              {detailBill.memo ? (
                <View className="bg-[#fffbeb] rounded-xl p-4 mb-4">
                  <Text className="text-xs text-gray-400 font-Jakarta uppercase tracking-wider mb-1">
                    Memo
                  </Text>
                  <Text className="font-Jakarta text-sm text-[#92400e]">
                    {detailBill.memo}
                  </Text>
                </View>
              ) : null}

              {/* Actions */}
              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  onPress={() => {
                    shareBillAsPdf(detailBill);
                  }}
                  className="flex-1 flex-row items-center justify-center gap-2 bg-[#FEE500] py-4 rounded-full"
                >
                  <Ionicons name="share-outline" size={18} color="#3C1E1E" />
                  <Text className="font-JakartaBold text-sm text-[#3C1E1E]">
                    Share via KakaoTalk
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setDetailBill(null);
                    handleDelete(detailBill._id);
                  }}
                  className="bg-red-50 p-4 rounded-full"
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}
