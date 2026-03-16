import { GET_NOTICES } from "@/apollo/user/query";
import { Notice } from "@/types/cs/notice";
import { useQuery } from "@apollo/client/react";

interface NoticesResponse {
  getNotices: Notice[];
}

export function useNotices(input: Record<string, string>) {
  const {
    loading: noticesLoading,
    data: noticesData,
    error: noticesError,
    refetch: noticesRefetch,
  } = useQuery<NoticesResponse>(GET_NOTICES, {
    fetchPolicy: "network-only",
    variables: { input },
    notifyOnNetworkStatusChange: true,
  });

  return {
    noticesLoading,
    noticesData,
    noticesError,
    noticesRefetch,
  };
}