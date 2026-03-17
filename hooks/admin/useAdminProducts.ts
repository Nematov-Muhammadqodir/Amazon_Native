import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_PRODUCTS_BY_ADMIN } from "@/apollo/admin/query";
import {
  UPDATE_PRODUCT_BY_ADMIN,
  DELETE_PRODUCT_BY_ADMIN,
} from "@/apollo/admin/mutation";

export function useAdminProducts(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: {
    productStatus?: string;
    productCollection?: string;
    text?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_ALL_PRODUCTS_BY_ADMIN,
    {
      variables: { input },
      fetchPolicy: "network-only",
    }
  );

  const [updateProduct] = useMutation<any>(UPDATE_PRODUCT_BY_ADMIN);
  const [deleteProduct] = useMutation<any>(DELETE_PRODUCT_BY_ADMIN);

  return {
    products: data?.getAllProductsByAdmin?.list ?? [],
    total: data?.getAllProductsByAdmin?.metaCounter?.total ?? 0,
    loading,
    error,
    refetch,
    updateProductByAdmin: async (productInput: any) => {
      const result = await updateProduct({
        variables: { input: productInput },
      });
      return result.data?.updateProductByAdmin;
    },
    deleteProductByAdmin: async (productId: string) => {
      const result = await deleteProduct({
        variables: { input: productId },
      });
      return result.data?.deleteProductByAdmin;
    },
  };
}
