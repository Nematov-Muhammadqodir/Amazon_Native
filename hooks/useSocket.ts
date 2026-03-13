import { getSocket, initSocket } from "@/libs/socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(getSocket());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const s = initSocket(userId); // reuses existing or creates new
    setSocket(s);

    const onConnect = () => {
      console.log("Socket connected:", s.id);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    // If already connected, set state immediately
    if (s.connected) setIsConnected(true);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
    };
  }, [userId]);

  return { socket, isConnected };
};
