import { useQuery } from "@apollo/client/react";
import { GET_VENDOR_FRIDGE } from "@/apollo/vendor/loan-query";

export function useVendorFridge(
  vendorId: string,
  input: {
    page: number;
    limit: number;
    search: { text?: string };
  }
) {
  const { data, loading, error, refetch } = useQuery<any>(GET_VENDOR_FRIDGE, {
    variables: { vendorId, input },
    fetchPolicy: "network-only",
    skip: !vendorId,
  });

  return {
    fridgeItems: data?.getVendorFridge?.list ?? [],
    total: data?.getVendorFridge?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
  };
}
