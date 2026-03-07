import { GET_PRODUCTS } from "@/apollo/user/query";
import AllProducts from "@/components/AllProducts";
import Category from "@/components/Category";
import HomeLayout from "@/components/layouts/HomeLayout";
import { images } from "@/constants";
import { Direction } from "@/libs/enums/common.enum";
import { ProductCollection, ProductFrom } from "@/libs/enums/product.enum";
import { Products } from "@/types/product/product";
import { ProductsInquiry } from "@/types/product/product.input";
import { useQuery } from "@apollo/client/react";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

interface GetProductsResponse {
  getProducts: Products;
}

export default function ProductsPage() {
  const { collection } = useLocalSearchParams();
  console.log("Collection", collection);
  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({
    page: 1,
    limit: 20,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      productPrice: {
        start: 0,
        end: 20000000,
      },
      // productOrigin: [],
    },
  });

  const handleSearchByCollection = (collection: ProductCollection) => {
    if (collection === ProductCollection.ALL) {
      setSearchFilter({
        ...searchFilter,
        search: {},
      });
    } else
      setSearchFilter({
        ...searchFilter,
        search: { productCollection: collection },
      });
  };
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

  const handleFiltering = (value: string) => {
    switch (value) {
      case "lowestPrice":
        setSearchFilter({
          ...searchFilter,
          sort: "productPrice",
          direction: Direction.ASC,
        });
        break;

      case "highestPrice":
        setSearchFilter({
          ...searchFilter,
          sort: "productPrice",
          direction: Direction.DESC,
        });
        break;

      case "new":
        setSearchFilter({
          ...searchFilter,
          direction: Direction.DESC,
        });
        break;

      case "old":
        setSearchFilter({
          ...searchFilter,
          direction: Direction.ASC,
        });
        break;
      case "highDiscount":
        setSearchFilter({
          ...searchFilter,
          sort: "productDiscountRate",
          direction: Direction.DESC,
        });
        break;
      case "lowDiscount":
        setSearchFilter({
          ...searchFilter,
          direction: Direction.ASC,
        });
        break;

      default:
        break;
    }
  };
  const handleFilteringByLocation = (location: ProductFrom) => {
    const currentLocations = searchFilter.search.productOrigin || [];

    const exists = currentLocations.includes(location);

    const updatedLocations = exists
      ? currentLocations.filter((l) => l !== location)
      : [...currentLocations, location];

    if (!updatedLocations.length) {
      const { productOrigin, ...restSearch } = searchFilter.search;

      setSearchFilter({
        ...searchFilter,
        search: restSearch,
      });
    } else {
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          productOrigin: updatedLocations,
        },
      });
    }
  };

  useEffect(() => {
    if (!collection) {
      setSearchFilter((prev) => ({
        ...prev,
        search: {
          productPrice: {
            start: 0,
            end: 20000000,
          },
        },
      }));
    } else {
      setSearchFilter((prev) => ({
        ...prev,
        search: {
          ...prev.search,
          productCollection: collection as ProductCollection,
        },
      }));
    }
  }, [collection]);

  // useEffect(() => {
  //   getProductsRefetch({ input: searchFilter });
  // }, []);

  const products = getProductsData?.getProducts.list;
  return (
    <HomeLayout>
      <View className="px-5 mb-[45px]">
        <Category handleSearchByCollection={handleSearchByCollection} />
        {products?.length ? (
          <AllProducts
            products={products}
            handleFiltering={handleFiltering}
            handleFilteringByLocation={handleFilteringByLocation}
            selectedLocations={searchFilter.search.productOrigin}
          />
        ) : (
          <View className="flex-1 justify-center items-center mt-[40px]">
            <Image source={images.noResult} className="w-[200px] h-[200px]" />
            <Text className="font-JakartaBold text-[30px]">
              Products Not Found
            </Text>
          </View>
        )}
      </View>
    </HomeLayout>
  );
}
