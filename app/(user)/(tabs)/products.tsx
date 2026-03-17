import AllProducts from "@/components/AllProducts";
import Category from "@/components/Category";
import HomeLayout from "@/components/layouts/HomeLayout";
import MenuDropdown from "@/components/MenuDropdown";
import { images } from "@/constants";
import { useProducts } from "@/hooks/useProducts";
import { Direction } from "@/libs/enums/common.enum";
import { ProductCollection, ProductFrom } from "@/libs/enums/product.enum";
import { ProductsInquiry } from "@/types/product/product.input";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function ProductsPage() {
  const { collection } = useLocalSearchParams();
  const locations = Object.values(ProductFrom);

  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({
    page: 1,
    limit: 10,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      productPrice: { start: 0, end: 20000000 },
    },
  });

  const handleSearchByCollection = (collection: ProductCollection) => {
    if (collection === ProductCollection.ALL) {
      setSearchFilter({ ...searchFilter, search: {} });
    } else {
      setSearchFilter({
        ...searchFilter,
        search: { productCollection: collection },
      });
    }
  };

  const { getProductsData } = useProducts(searchFilter);

  const handleFiltering = (value: string) => {
    switch (value) {
      case "lowestPrice":
        setSearchFilter({ ...searchFilter, sort: "productPrice", direction: Direction.ASC });
        break;
      case "highestPrice":
        setSearchFilter({ ...searchFilter, sort: "productPrice", direction: Direction.DESC });
        break;
      case "new":
        setSearchFilter({ ...searchFilter, direction: Direction.DESC });
        break;
      case "old":
        setSearchFilter({ ...searchFilter, direction: Direction.ASC });
        break;
      case "highDiscount":
        setSearchFilter({ ...searchFilter, sort: "productDiscountRate", direction: Direction.DESC });
        break;
      case "lowDiscount":
        setSearchFilter({ ...searchFilter, direction: Direction.ASC });
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
      setSearchFilter({ ...searchFilter, search: restSearch });
    } else {
      setSearchFilter({
        ...searchFilter,
        search: { ...searchFilter.search, productOrigin: updatedLocations },
      });
    }
  };

  useEffect(() => {
    if (!collection) {
      setSearchFilter((prev) => ({
        ...prev,
        search: { productPrice: { start: 0, end: 20000000 } },
      }));
    } else {
      setSearchFilter((prev) => ({
        ...prev,
        search: { ...prev.search, productCollection: collection as ProductCollection },
      }));
    }
  }, [collection]);

  const handlePageChange = (page: number) => {
    setSearchFilter({ ...searchFilter, page });
  };

  const products = getProductsData?.getProducts.list;
  const total = getProductsData?.getProducts?.metaCounter[0]?.total || 0;
  const totalPages = Math.ceil(total / searchFilter.limit);

  return (
    <HomeLayout>
      <View className="px-5 mb-[45px]">
        <Category handleSearchByCollection={handleSearchByCollection} />
        <View className="flex flex-row justify-between mt-10">
          <MenuDropdown
            selected="Location"
            options={locations.map((location) => ({
              text: location,
              onSelect: () => handleFilteringByLocation(location),
              fontFamily: searchFilter.search.productOrigin?.includes(location)
                ? "Jakarta-ExtraBold"
                : "Jakarta-Medium",
              selected: searchFilter.search.productOrigin?.includes(location) ? true : false,
            }))}
            triggerIcon={<Entypo name="location" size={24} color="black" />}
          />
          <Text className="text-[20px] font-JakartaExtraBold flex self-center">All Products</Text>
          <MenuDropdown
            options={[
              { text: "Lowest Price", onSelect: () => handleFiltering("lowestPrice") },
              { text: "Highest Price", onSelect: () => handleFiltering("highestPrice") },
              { text: "Newest Products", onSelect: () => handleFiltering("new") },
              { text: "Oldest Products", onSelect: () => handleFiltering("old") },
              { text: "Highest Discount", onSelect: () => handleFiltering("highDiscount") },
              { text: "Lowest Discount", onSelect: () => handleFiltering("lowDiscount") },
            ]}
            triggerIcon={<AntDesign name="filter" size={24} color="black" />}
          />
        </View>
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
            <Text className="font-JakartaBold text-[30px]">Products Not Found</Text>
          </View>
        )}
        {totalPages > 1 && (
          <View className="flex flex-row flex-wrap justify-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <Text
                  key={page}
                  onPress={() => handlePageChange(page)}
                  className={`px-4 py-2 border rounded-md ${
                    searchFilter.page === page ? "bg-black text-white" : ""
                  }`}
                >
                  {page}
                </Text>
              );
            })}
          </View>
        )}
      </View>
    </HomeLayout>
  );
}
