import { GET_PRODUCTS } from "@/apollo/user/query";
import { Direction } from "@/libs/enums/common.enum";
import { Products } from "@/types/product/product";
import { ProductsInquiry } from "@/types/product/product.input";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

interface GetProductsResponse {
  getProducts: Products;
}
interface UseNewProductsParams {
  sort?: string;
  search?: ProductsInquiry["search"];
}

export const useNewProducts = ({
  sort = "createdAt",
  search = {},
}: UseNewProductsParams = {}) => {
  const [input, setInput] = useState<ProductsInquiry>({
    page: 1,
    limit: 10,
    sort,
    direction: Direction.DESC,
    search,
  });

  const { loading, data, error, refetch, fetchMore } =
    useQuery<GetProductsResponse>(GET_PRODUCTS, {
      fetchPolicy: "cache-and-network",
      variables: { input },
      notifyOnNetworkStatusChange: true,
    });

  const products = data?.getProducts.list ?? [];
  const total = data?.getProducts.metaCounter?.[0]?.total ?? 0;

  return {
    loading,
    data,
    error,
    refetch,
    fetchMore,
    products,
    total,
    input,
    setInput,
  };
};
