import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { useVendorProducts } from "@/hooks/vendor/useVendorProducts";
import { ProductCollection } from "@/libs/enums/product.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const COLLECTIONS = Object.values(ProductCollection).filter(
  (c) => c !== "ALL"
);

export default function CreateProduct() {
  const user = useReactiveVar(userVar);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { createProduct } = useVendorProducts({
    page: 1,
    limit: 1,
    search: {},
  });

  const [input, setInput] = useState({
    productName: "",
    productPrice: "",
    productOriginPrice: "",
    productLeftCount: "",
    productDesc: "",
    productCollection: "" as ProductCollection,
    productOrigin: "",
  });

  const handleInput = useCallback((name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (
      !input.productName ||
      !input.productPrice ||
      !input.productOriginPrice ||
      !input.productLeftCount ||
      !input.productCollection
    ) {
      await sweetErrorAlert("Please fill in all required fields");
      return;
    }

    if (input.productName.length < 3) {
      await sweetErrorAlert("Product name must be at least 3 characters");
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        productName: input.productName,
        productPrice: Number(input.productPrice),
        productOriginPrice: Number(input.productOriginPrice),
        productLeftCount: Number(input.productLeftCount),
        productCollection: input.productCollection,
        productOrigin: input.productOrigin || undefined,
        productDesc: input.productDesc || undefined,
        productImages: images.length > 0 ? images : undefined,
      });

      Toast.show({ type: "success", text1: "Product created successfully!" });

      // Reset form
      setInput({
        productName: "",
        productPrice: "",
        productOriginPrice: "",
        productLeftCount: "",
        productDesc: "",
        productCollection: "" as ProductCollection,
        productOrigin: "",
      });
      setImages([]);
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5 pt-4 pb-3">
          <Text className="text-2xl font-JakartaExtraBold text-[#2D4D23]">
            Add New Product
          </Text>
        </View>

        <View className="px-5">
          {/* Image Picker */}
          <Text className="text-lg font-JakartaSemiBold mb-3">
            Product Images
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3 mb-4">
              {images.map((uri, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri }}
                    className="w-24 h-24 rounded-xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                  >
                    <Ionicons name="close" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={pickImages}
                className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 items-center justify-center"
              >
                <Ionicons name="camera" size={28} color="#999" />
                <Text className="text-xs text-gray-400 mt-1">Add</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Collection Picker */}
          <Text className="text-lg font-JakartaSemiBold mb-3">
            Category <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {COLLECTIONS.map((col) => {
              const isSelected = input.productCollection === col;
              return (
                <TouchableOpacity
                  key={col}
                  onPress={() => handleInput("productCollection", col)}
                  className={`px-3 py-2 rounded-full ${
                    isSelected
                      ? "bg-[#2D4D23]"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-JakartaSemiBold ${
                      isSelected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {col.replace(/_/g, " ")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <InputField
            label="Product Name *"
            placeholder="Enter product name"
            value={input.productName}
            onChangeText={(v) => handleInput("productName", v)}
          />
          <InputField
            label="Price *"
            placeholder="Enter price"
            value={input.productPrice}
            onChangeText={(v) => handleInput("productPrice", v)}
            keyboardType="numeric"
          />
          <InputField
            label="Original Price *"
            placeholder="Enter original price"
            value={input.productOriginPrice}
            onChangeText={(v) => handleInput("productOriginPrice", v)}
            keyboardType="numeric"
          />
          <InputField
            label="Stock Count *"
            placeholder="How many in stock?"
            value={input.productLeftCount}
            onChangeText={(v) => handleInput("productLeftCount", v)}
            keyboardType="numeric"
          />
          <InputField
            label="Origin"
            placeholder="e.g. KOREA, CHINA, US"
            value={input.productOrigin}
            onChangeText={(v) => handleInput("productOrigin", v)}
          />
          <InputField
            label="Description"
            placeholder="Describe your product"
            value={input.productDesc}
            onChangeText={(v) => handleInput("productDesc", v)}
          />

          <CustomButton
            title={loading ? "" : "Create Product"}
            bgVariant="dark-green"
            className="mt-6"
            onPress={handleCreate}
            disabled={loading}
            IconLeft={
              loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : undefined
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
