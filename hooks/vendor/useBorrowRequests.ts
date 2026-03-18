import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_INCOMING_REQUESTS,
  GET_MY_REQUESTS,
} from "@/apollo/vendor/loan-query";
import {
  CREATE_BORROW_REQUEST,
  APPROVE_BORROW_REQUEST,
  REJECT_BORROW_REQUEST,
} from "@/apollo/vendor/loan-mutation";

export function useIncomingRequests(input: {
  page: number;
  limit: number;
  search: { status?: string };
}) {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_INCOMING_REQUESTS,
    { variables: { input }, fetchPolicy: "network-only" }
  );

  const [approveMutation] = useMutation<any>(APPROVE_BORROW_REQUEST);
  const [rejectMutation] = useMutation<any>(REJECT_BORROW_REQUEST);

  return {
    requests: data?.getIncomingRequests?.list ?? [],
    total: data?.getIncomingRequests?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
    approveRequest: async (requestId: string) => {
      const result = await approveMutation({ variables: { requestId } });
      return result.data?.approveBorrowRequest;
    },
    rejectRequest: async (requestId: string) => {
      const result = await rejectMutation({ variables: { requestId } });
      return result.data?.rejectBorrowRequest;
    },
  };
}

export function useMyBorrowRequests(input: {
  page: number;
  limit: number;
  search: { status?: string };
}) {
  const { data, loading, error, refetch } = useQuery<any>(GET_MY_REQUESTS, {
    variables: { input },
    fetchPolicy: "network-only",
  });

  return {
    requests: data?.getMyRequests?.list ?? [],
    total: data?.getMyRequests?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
  };
}

export function useCreateBorrowRequest() {
  const [mutation] = useMutation<any>(CREATE_BORROW_REQUEST);

  return {
    createBorrowRequest: async (input: any) => {
      const result = await mutation({ variables: { input } });
      return result.data?.createBorrowRequest;
    },
  };
}
