import { useNewProducts } from "@/hooks/useNewProducts";
import { ProductCollection } from "@/libs/enums/product.enum";
import { Product } from "@/types/product/product";
import React from "react";
import { View } from "react-native";
import FeaturedProductCard from "./FeaturedProductCard";

export default function FeaturedProducts({
  collection = ProductCollection.FRUITS,
  id,
}: {
  collection: ProductCollection;
  id: string;
}) {
  const { products, loading } = useNewProducts({
    search: { productCollection: collection },
  });

  const filteredProducts = products.filter((product) => product._id !== id);
  return (
    <View className="gap-3">
      {filteredProducts.map((product: Product) => (
        <View key={product._id}>
          <FeaturedProductCard product={product} />
        </View>
      ))}
    </View>
  );
}
