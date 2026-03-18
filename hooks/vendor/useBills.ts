import { useQuery, useMutation } from "@apollo/client/react";
import { GET_BILLS } from "@/apollo/vendor/bill-query";
import { CREATE_BILL, DELETE_BILL } from "@/apollo/vendor/bill-mutation";

export function useBills(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: {
    billStatus?: string;
    customerName?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(GET_BILLS, {
    variables: { input },
    fetchPolicy: "network-only",
  });

  const [createBillMutation] = useMutation<any>(CREATE_BILL);
  const [deleteBillMutation] = useMutation<any>(DELETE_BILL);

  return {
    bills: data?.getBills?.list ?? [],
    total: data?.getBills?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
    createBill: async (billInput: any) => {
      const result = await createBillMutation({
        variables: { input: billInput },
      });
      return result.data?.createBill;
    },
    deleteBill: async (billId: string) => {
      const result = await deleteBillMutation({
        variables: { billId },
      });
      return result.data?.deleteBill;
    },
  };
}
