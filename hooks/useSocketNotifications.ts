import { NotificationType } from "@/libs/enums/notice.enum";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";
import { useNotificationSound } from "./useNotificationSound";

/**
 * Listens to all socket events and plays KakaoTalk-style sound + vibration.
 * Mount this once in a parent component (e.g., vendor tab layout or root).
 */
export function useSocketNotifications(
  socket: Socket | null,
  currentUserId: string
) {
  const { playNotification } = useNotificationSound();

  useEffect(() => {
    if (!socket) return;

    // Chat message received (skip if I'm the sender)
    const handleMessage = (data: any) => {
      if (String(data?.senderId) === String(currentUserId)) return;
      playNotification();
      Toast.show({
        type: "info",
        text1: "New Message",
        text2: data?.text || "You have a new message",
        visibilityTime: 3000,
      });
    };

    // Borrow request received (I'm the lender)
    const handleBorrowRequest = (data: any) => {
      playNotification();
      Toast.show({
        type: "info",
        text1: "Borrow Request",
        text2: `${data?.requesterName || "A vendor"} wants to borrow ${data?.productName || "a product"}`,
        visibilityTime: 4000,
      });
    };

    // Borrow request update (approved/rejected — I'm the borrower)
    const handleBorrowUpdate = (data: any) => {
      playNotification();
      const isApproved = data?.status === "APPROVED";
      Toast.show({
        type: isApproved ? "success" : "error",
        text1: isApproved ? "Request Approved!" : "Request Rejected",
        text2: isApproved
          ? `Your borrow request was approved. Stock transferred!`
          : `Your borrow request was rejected.`,
        visibilityTime: 4000,
      });
    };

    // Loan paid notification
    const handleLoanPaid = (data: any) => {
      playNotification();
      Toast.show({
        type: "success",
        text1: "Loan Paid",
        text2: data?.message || "A loan has been marked as paid",
        visibilityTime: 3000,
      });
    };

    // Pub/Sub notification handler (product-events, follow-events, chat-events)
    const handleNotification = (data: any) => {
      playNotification();

      const message = data?.notificationMessage || "";
      const type = data?.notificationType;

      switch (type) {
        case NotificationType.SEND_MESSAGE:
          Toast.show({
            type: "info",
            text1: `New Message`,
            text2: message,
            visibilityTime: 3000,
          });
          break;
        case NotificationType.SUBSCRIBED:
          Toast.show({
            type: "success",
            text1: "New Follower",
            text2: message,
            visibilityTime: 3000,
          });
          break;
        case NotificationType.UNSUBSCRIBED:
          Toast.show({
            type: "info",
            text1: "Unfollowed",
            text2: message,
            visibilityTime: 3000,
          });
          break;
        case NotificationType.PRODUCT_SOLD:
          Toast.show({
            type: "success",
            text1: "Product Sold!",
            text2: message,
            visibilityTime: 4000,
          });
          break;
        case NotificationType.PRODUCT_DELETED:
          Toast.show({
            type: "error",
            text1: "Product Deleted",
            text2: message,
            visibilityTime: 4000,
          });
          break;
        default:
          Toast.show({
            type: "info",
            text1: "Notification",
            text2: message,
            visibilityTime: 3000,
          });
          break;
      }
    };

    // Register all listeners
    socket.on("newMessage", handleMessage);
    socket.on("newBorrowRequest", handleBorrowRequest);
    socket.on("borrowRequestUpdate", handleBorrowUpdate);
    socket.on("loanPaid", handleLoanPaid);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("newMessage", handleMessage);
      socket.off("newBorrowRequest", handleBorrowRequest);
      socket.off("borrowRequestUpdate", handleBorrowUpdate);
      socket.off("loanPaid", handleLoanPaid);
      socket.off("notification", handleNotification);
    };
  }, [socket, playNotification]);
}
