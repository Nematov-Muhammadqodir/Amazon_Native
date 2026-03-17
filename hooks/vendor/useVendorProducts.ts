import { useQuery, useMutation } from "@apollo/client/react";
import { GET_VENDOR_PRODUCTS } from "@/apollo/vendor/query";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "@/apollo/vendor/mutation";

export function useVendorProducts(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: {
    productStatus?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(GET_VENDOR_PRODUCTS, {
    variables: { input },
    fetchPolicy: "network-only",
  });

  const [createProductMutation] = useMutation<any>(CREATE_PRODUCT);
  const [updateProductMutation] = useMutation<any>(UPDATE_PRODUCT);

  return {
    products: data?.getVendorProducts?.list ?? [],
    total: data?.getVendorProducts?.metaCounter?.total ?? 0,
    loading,
    error,
    refetch,
    createProduct: async (productInput: any) => {
      const result = await createProductMutation({
        variables: { input: productInput },
      });
      return result.data?.createProduct;
    },
    updateProduct: async (productInput: any) => {
      const result = await updateProductMutation({
        variables: { input: productInput },
      });
      return result.data?.updateProduct;
    },
  };
}
