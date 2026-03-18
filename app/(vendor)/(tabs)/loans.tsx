import { userVar } from "@/apollo/store";
import {
  useIncomingRequests,
} from "@/hooks/vendor/useBorrowRequests";
import { useMyLoans, useGivenLoans } from "@/hooks/vendor/useLoans";
import { generateLoanHtml } from "@/libs/utils/generateLoanPdf";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { router, useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type Tab = "borrowed" | "lent" | "requests";
const STATUS_FILTERS = ["ALL", "OPEN", "PAID"] as const;

export default function Loans() {
  const user = useReactiveVar(userVar);
  const [activeTab, setActiveTab] = useState<Tab>("borrowed");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [detailLoan, setDetailLoan] = useState<any>(null);

  const { loans: myLoans, loading: myLoading, refetch: refetchMy } = useMyLoans({
    page: 1, limit: 50, search: { ...(statusFilter ? { status: statusFilter } : {}) },
  });

  const { loans: givenLoans, loading: givenLoading, refetch: refetchGiven, markLoanPaid } = useGivenLoans({
    page: 1, limit: 50, search: { ...(statusFilter ? { status: statusFilter } : {}) },
  });

  const { requests, loading: reqLoading, refetch: refetchReqs, approveRequest, rejectRequest } = useIncomingRequests({
    page: 1, limit: 50, search: { status: "PENDING" },
  });

  useFocusEffect(useCallback(() => {
    refetchMy(); refetchGiven(); refetchReqs();
  }, [refetchMy, refetchGiven, refetchReqs]));

  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest(requestId);
      Toast.show({ type: "success", text1: "Approved! Stock transferred." });
      refetchReqs(); refetchGiven();
    } catch (err: any) { sweetErrorAlert(err?.message || "Approve failed"); }
  };

  const handleReject = async (requestId: string) => {
    Alert.alert("Reject Request", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: async () => {
        try {
          await rejectRequest(requestId);
          Toast.show({ type: "success", text1: "Request rejected" });
          refetchReqs();
        } catch (err: any) { sweetErrorAlert(err?.message || "Reject failed"); }
      }},
    ]);
  };

  const handleMarkPaid = async (loanId: string) => {
    Alert.alert("Mark as Paid", "Confirm this loan has been paid?", [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: async () => {
        try {
          await markLoanPaid(loanId);
          Toast.show({ type: "success", text1: "Loan marked as paid!" });
          refetchGiven();
        } catch (err: any) { sweetErrorAlert(err?.message || "Failed"); }
      }},
    ]);
  };

  const shareLoanPdf = async (loan: any) => {
    try {
      const html = generateLoanHtml({
        lenderName: loan.lenderData?.memberNick || loan.borrowerData?.memberNick || "Vendor",
        borrowerName: loan.borrowerData?.memberNick || loan.lenderData?.memberNick || "Vendor",
        loanDate: loan.loanDate,
        status: loan.status,
        items: loan.items,
        totalAmount: loan.totalAmount,
        paidAt: loan.paidAt,
      });
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf" });
      }
    } catch { sweetErrorAlert("Failed to generate PDF"); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return { bg: "bg-yellow-100", text: "text-yellow-700" };
      case "PAID": return { bg: "bg-green-100", text: "text-green-700" };
      case "OVERDUE": return { bg: "bg-red-100", text: "text-red-700" };
      default: return { bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  const renderLoanCard = (loan: any, isLender: boolean) => {
    const counterparty = isLender ? loan.borrowerData : loan.lenderData;
    const style = getStatusColor(loan.status);
    return (
      <TouchableOpacity
        key={loan._id}
        activeOpacity={0.7}
        onPress={() => setDetailLoan({ ...loan, isLender })}
        className="bg-white rounded-2xl mb-3 p-4 shadow-sm"
        style={{ maxHeight: 140, overflow: "hidden" }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="font-JakartaBold text-base">{counterparty?.memberNick || "Vendor"}</Text>
            <Text className="text-xs text-gray-400 font-Jakarta mt-0.5">
              {new Date(loan.loanDate).toLocaleDateString("ko-KR")} | {loan.items.length} item{loan.items.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <View className="items-end">
            <Text className="font-JakartaExtraBold text-lg text-[#1a1a2e]">₩{loan.totalAmount.toLocaleString()}</Text>
            <View className={`px-2 py-0.5 rounded-full mt-1 ${style.bg}`}>
              <Text className={`text-[10px] font-JakartaSemiBold ${style.text}`}>{loan.status}</Text>
            </View>
          </View>
        </View>
        <View className="mt-2 bg-gray-50 rounded-lg p-2">
          {loan.items.slice(0, 2).map((item: any, i: number) => (
            <Text key={i} className="text-xs font-Jakarta text-gray-600">
              {item.productName} — {item.quantity}{item.unit}
            </Text>
          ))}
          {loan.items.length > 2 && <Text className="text-[10px] text-gray-400">+{loan.items.length - 2} more</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRequest = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl mb-3 p-4 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-JakartaBold text-base">{item.requesterData?.memberNick || "Vendor"}</Text>
          <Text className="text-xs text-gray-400 font-Jakarta">wants to borrow</Text>
        </View>
        <View className="items-end">
          <Text className="font-JakartaExtraBold text-[#2D4D23]">{item.quantity} {item.unit}</Text>
          <Text className="text-xs text-gray-500 font-Jakarta">{item.productName}</Text>
        </View>
      </View>
      {item.unitPrice > 0 && (
        <Text className="text-xs text-gray-400 font-Jakarta mt-1">₩{item.unitPrice.toLocaleString()}/{item.unit}</Text>
      )}
      {item.message ? <Text className="text-xs text-gray-500 font-Jakarta mt-1 italic">"{item.message}"</Text> : null}
      <View className="flex-row gap-3 mt-3">
        <TouchableOpacity onPress={() => handleApprove(item._id)} className="flex-1 bg-[#2D4D23] py-3 rounded-full items-center">
          <Text className="text-white font-JakartaBold text-sm">Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleReject(item._id)} className="flex-1 bg-red-50 py-3 rounded-full items-center">
          <Text className="text-red-600 font-JakartaBold text-sm">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-JakartaExtraBold text-[#1a1a2e]">Loans</Text>
          <TouchableOpacity
            onPress={() => router.push("/(vendor)/(tabs)/browse-vendors" as any)}
            className="bg-[#1a1a2e] px-4 py-2.5 rounded-full flex-row items-center gap-2"
          >
            <Ionicons name="search" size={16} color="white" />
            <Text className="text-white font-JakartaBold text-xs">Browse Vendors</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Switcher */}
      <View className="px-5 mb-3 flex-row gap-2">
        {(["borrowed", "lent", "requests"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === tab ? "bg-[#1a1a2e]" : "bg-white border border-gray-200"}`}
          >
            <Text className={`font-JakartaSemiBold text-xs capitalize ${activeTab === tab ? "text-white" : "text-gray-600"}`}>
              {tab}{tab === "requests" && requests.length > 0 ? ` (${requests.length})` : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Status Filter (for borrowed/lent) */}
      {activeTab !== "requests" && (
        <View className="px-5 mb-3">
          <FlatList horizontal showsHorizontalScrollIndicator={false} data={STATUS_FILTERS} keyExtractor={(i) => i}
            renderItem={({ item }) => {
              const isSelected = item === "ALL" ? !statusFilter : statusFilter === item;
              return (
                <TouchableOpacity onPress={() => setStatusFilter(item === "ALL" ? undefined : item)}
                  className={`mr-2 px-4 py-2 rounded-full ${isSelected ? "bg-[#1a1a2e]" : "bg-white border border-gray-200"}`}>
                  <Text className={`text-xs font-JakartaSemiBold ${isSelected ? "text-white" : "text-gray-600"}`}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* Content */}
      {activeTab === "borrowed" && (
        myLoading ? <ActivityIndicator size="large" color="#1a1a2e" className="mt-10" /> :
        <FlatList data={myLoans} keyExtractor={(i) => i._id} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          renderItem={({ item }) => renderLoanCard(item, false)}
          ListEmptyComponent={<View className="items-center mt-16"><Ionicons name="document-outline" size={50} color="#ccc" /><Text className="font-JakartaBold text-gray-400 mt-3">No borrowed loans</Text></View>}
        />
      )}

      {activeTab === "lent" && (
        givenLoading ? <ActivityIndicator size="large" color="#1a1a2e" className="mt-10" /> :
        <FlatList data={givenLoans} keyExtractor={(i) => i._id} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          renderItem={({ item }) => renderLoanCard(item, true)}
          ListEmptyComponent={<View className="items-center mt-16"><Ionicons name="document-outline" size={50} color="#ccc" /><Text className="font-JakartaBold text-gray-400 mt-3">No given loans</Text></View>}
        />
      )}

      {activeTab === "requests" && (
        reqLoading ? <ActivityIndicator size="large" color="#1a1a2e" className="mt-10" /> :
        <FlatList data={requests} keyExtractor={(i) => i._id} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          renderItem={renderRequest}
          ListEmptyComponent={<View className="items-center mt-16"><Ionicons name="checkmark-circle-outline" size={50} color="#ccc" /><Text className="font-JakartaBold text-gray-400 mt-3">No pending requests</Text></View>}
        />
      )}

      {/* Loan Detail Modal */}
      <Modal visible={!!detailLoan} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailLoan(null)}>
        {detailLoan && (
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-5 pt-4 pb-3 border-b border-gray-100">
              <Text className="text-xl font-JakartaExtraBold text-[#1a1a2e]">Loan Details</Text>
              <TouchableOpacity onPress={() => setDetailLoan(null)}><Ionicons name="close" size={24} color="#666" /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1 bg-gray-50 rounded-xl p-4">
                  <Text className="text-xs text-gray-400 font-Jakarta uppercase">Lender</Text>
                  <Text className="font-JakartaBold text-base mt-1">{detailLoan.lenderData?.memberNick || (detailLoan.isLender ? user.memberNick : "")}</Text>
                </View>
                <View className="flex-1 bg-gray-50 rounded-xl p-4">
                  <Text className="text-xs text-gray-400 font-Jakarta uppercase">Borrower</Text>
                  <Text className="font-JakartaBold text-base mt-1">{detailLoan.borrowerData?.memberNick || (!detailLoan.isLender ? user.memberNick : "")}</Text>
                </View>
              </View>
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1 bg-gray-50 rounded-xl p-4">
                  <Text className="text-xs text-gray-400 font-Jakarta uppercase">Date</Text>
                  <Text className="font-JakartaSemiBold text-sm mt-1">{new Date(detailLoan.loanDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</Text>
                </View>
                <View className={`flex-1 rounded-xl p-4 ${getStatusColor(detailLoan.status).bg}`}>
                  <Text className="text-xs text-gray-400 font-Jakarta uppercase">Status</Text>
                  <Text className={`font-JakartaBold text-base mt-1 ${getStatusColor(detailLoan.status).text}`}>{detailLoan.status}</Text>
                </View>
              </View>

              {/* Items table */}
              <View className="bg-gray-50 rounded-xl overflow-hidden mb-4">
                <View className="flex-row bg-[#1a1a2e] px-4 py-3">
                  <Text className="flex-1 text-xs font-JakartaBold text-white">Product</Text>
                  <Text className="w-16 text-xs font-JakartaBold text-white text-center">Qty</Text>
                  <Text className="w-20 text-xs font-JakartaBold text-white text-right">Price</Text>
                  <Text className="w-24 text-xs font-JakartaBold text-white text-right">Total</Text>
                </View>
                {detailLoan.items.map((prod: any, i: number) => (
                  <View key={i} className={`flex-row px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <Text className="flex-1 text-sm font-JakartaSemiBold text-gray-800">{prod.productName}</Text>
                    <Text className="w-16 text-sm font-Jakarta text-gray-600 text-center">{prod.quantity}{prod.unit}</Text>
                    <Text className="w-20 text-sm font-Jakarta text-gray-600 text-right">₩{prod.unitPrice?.toLocaleString()}</Text>
                    <Text className="w-24 text-sm font-JakartaBold text-gray-800 text-right">₩{prod.totalPrice?.toLocaleString()}</Text>
                  </View>
                ))}
                <View className="flex-row bg-[#f0f0f7] px-4 py-4">
                  <Text className="flex-1 font-JakartaBold text-gray-700">TOTAL</Text>
                  <Text className="font-JakartaExtraBold text-xl text-[#1a1a2e]">₩{detailLoan.totalAmount.toLocaleString()}</Text>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => shareLoanPdf(detailLoan)} className="flex-1 flex-row items-center justify-center gap-2 bg-[#FEE500] py-4 rounded-full">
                  <Ionicons name="share-outline" size={18} color="#3C1E1E" />
                  <Text className="font-JakartaBold text-sm text-[#3C1E1E]">Share PDF</Text>
                </TouchableOpacity>
                {detailLoan.isLender && detailLoan.status === "OPEN" && (
                  <TouchableOpacity onPress={() => { setDetailLoan(null); handleMarkPaid(detailLoan._id); }} className="flex-1 bg-[#2D4D23] py-4 rounded-full items-center">
                    <Text className="text-white font-JakartaBold text-sm">Mark Paid</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}
