import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PURCHASES, GET_PURCHASE_SUMMARY } from "@/apollo/vendor/purchase-query";
import { CREATE_PURCHASE } from "@/apollo/vendor/purchase-mutation";

export function usePurchases(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: {
    startDate?: string;
    endDate?: string;
    productName?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(GET_PURCHASES, {
    variables: { input },
    fetchPolicy: "network-only",
  });

  const [createPurchaseMutation] = useMutation<any>(CREATE_PURCHASE);

  return {
    purchases: data?.getPurchases?.list ?? [],
    total: data?.getPurchases?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
    createPurchase: async (purchaseInput: any) => {
      const result = await createPurchaseMutation({
        variables: { input: purchaseInput },
      });
      return result.data?.createPurchase;
    },
  };
}

export function usePurchaseSummary(input: {
  startDate: string;
  endDate: string;
  productName?: string;
}) {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_PURCHASE_SUMMARY,
    {
      variables: { input },
      fetchPolicy: "network-only",
      skip: !input.startDate || !input.endDate,
    }
  );

  return {
    summary: data?.getPurchaseSummary ?? { items: [], grandTotal: 0 },
    loading,
    error,
    refetch,
  };
}
