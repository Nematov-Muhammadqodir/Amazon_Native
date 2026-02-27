import { GET_PRODUCT } from "@/apollo/user/query";
import { Product } from "@/types/product/product";
import { useQuery } from "@apollo/client/react";

interface ProductDetailInterface {
  getProduct: Product;
}

export function useProduct(id?: string) {
  const {
    loading: getProductLoading,
    data: getProductData,
    error: getProductError,
    refetch: getProductRefetch,
  } = useQuery<ProductDetailInterface>(GET_PRODUCT, {
    fetchPolicy: "cache-and-network",
    variables: { input: id },
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  return {
    getProductLoading,
    getProductData,
    getProductError,
    getProductRefetch,
  };
}
