import { GET_PRODUCTS } from "@/apollo/user/query";
import { Products } from "@/types/product/product";
import { ProductsInquiry } from "@/types/product/product.input";
import { useQuery } from "@apollo/client/react";

interface GetProductsResponse {
  getProducts: Products;
}

export function useProducts(input: ProductsInquiry) {
  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery<GetProductsResponse>(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input },
    notifyOnNetworkStatusChange: true,
  });

  return {
    getProductsLoading,
    getProductsData,
    getProductsError,
    getProductsRefetch,
  };
}