import { GET_PRODUCTS } from "@/apollo/user/query";
import AllProducts from "@/components/AllProducts";
import Category from "@/components/Category";
import HomeLayout from "@/components/layouts/HomeLayout";
import { Direction } from "@/libs/enums/common.enum";
import { Products } from "@/types/product/product";
import { ProductsInquiry } from "@/types/product/product.input";
import { useQuery } from "@apollo/client/react";
import React, { useState } from "react";
import { View } from "react-native";

interface GetProductsResponse {
  getProducts: Products;
}

export default function ProductsPage() {
  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({
    page: 1,
    limit: 6,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      productPrice: {
        start: 0,
        end: 2000000,
      },
    },
  });

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery<GetProductsResponse>(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  console.log("getProductsDataaa", getProductsData?.getProducts.list);
  const products = getProductsData?.getProducts.list;
  return (
    <HomeLayout>
      <View className="px-5 mb-[45px]">
        <Category />
        <AllProducts products={products} />
      </View>
    </HomeLayout>
  );
}
