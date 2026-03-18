import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_LOANS, GET_GIVEN_LOANS } from "@/apollo/vendor/loan-query";
import { MARK_LOAN_PAID } from "@/apollo/vendor/loan-mutation";

export function useMyLoans(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: { status?: string; startDate?: string; endDate?: string };
}) {
  const { data, loading, error, refetch } = useQuery<any>(GET_MY_LOANS, {
    variables: { input },
    fetchPolicy: "network-only",
  });

  return {
    loans: data?.getMyLoans?.list ?? [],
    total: data?.getMyLoans?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
  };
}

export function useGivenLoans(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: { status?: string; startDate?: string; endDate?: string };
}) {
  const { data, loading, error, refetch } = useQuery<any>(GET_GIVEN_LOANS, {
    variables: { input },
    fetchPolicy: "network-only",
  });

  const [markPaidMutation] = useMutation<any>(MARK_LOAN_PAID);

  return {
    loans: data?.getGivenLoans?.list ?? [],
    total: data?.getGivenLoans?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
    markLoanPaid: async (loanId: string) => {
      const result = await markPaidMutation({ variables: { loanId } });
      return result.data?.markLoanPaid;
    },
  };
}
