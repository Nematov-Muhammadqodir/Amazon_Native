import { userVar } from "@/apollo/store";
import CustomButton from "@/components/CustomButton";
import { useVendorProducts } from "@/hooks/vendor/useVendorProducts";
import { getToken } from "@/libs/auth";
import {
  ProductCollection,
  ProductFrom,
} from "@/libs/enums/product.enum";
import { sweetErrorAlert } from "@/types/sweetAlert";
import { useReactiveVar } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const COLLECTIONS = Object.values(ProductCollection).filter(
  (c) => c !== "ALL"
);
const ORIGINS = Object.values(ProductFrom);

export default function CreateProduct() {
  const user = useReactiveVar(userVar);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<
    { uri: string; fileName?: string; mimeType?: string }[]
  >([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);

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
    productOrigin: "" as string,
  });

  const handleInput = useCallback((name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  /** Upload images to backend using imagesUploader mutation */
  const uploadImages = async (
    pickedImages: { uri: string; fileName?: string; mimeType?: string }[]
  ): Promise<string[]> => {
    const token = await getToken();

    const formData = new FormData();

    // Build the file map for GraphQL multipart spec
    const fileMap: Record<string, string[]> = {};
    pickedImages.forEach((_, index) => {
      fileMap[String(index)] = [`variables.files.${index}`];
    });

    formData.append(
      "operations",
      JSON.stringify({
        query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
          imagesUploader(files: $files, target: $target)
        }`,
        variables: {
          files: pickedImages.map(() => null),
          target: "product",
        },
      })
    );

    formData.append("map", JSON.stringify(fileMap));

    pickedImages.forEach((img, index) => {
      formData.append(String(index), {
        uri: img.uri,
        name: img.fileName || `product_${index}.jpg`,
        type: img.mimeType || "image/jpeg",
      } as any);
    });

    const response = await axios.post(
      process.env.EXPO_PUBLIC_API_GRAPHQL_URL!,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "apollo-require-preflight": "true",
        },
      }
    );

    return response.data.data.imagesUploader;
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map((a) => ({
        uri: a.uri,
        fileName: a.fileName || undefined,
        mimeType: a.mimeType || undefined,
      }));

      setImages((prev) => [...prev, ...newImages]);

      // Upload immediately
      setUploading(true);
      try {
        const paths = await uploadImages(newImages);
        setUploadedPaths((prev) => [...prev, ...paths]);
        Toast.show({ type: "success", text1: "Images uploaded!" });
      } catch (err: any) {
        console.log("Upload error:", err);
        await sweetErrorAlert("Failed to upload images. Please try again.");
        // Remove the images that failed to upload
        setImages((prev) => prev.slice(0, prev.length - newImages.length));
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedPaths((prev) => prev.filter((_, i) => i !== index));
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
        productImages: uploadedPaths.length > 0 ? uploadedPaths : undefined,
      });

      Toast.show({ type: "success", text1: "Product created successfully!" });

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
      setUploadedPaths([]);
    } catch (err: any) {
      await sweetErrorAlert(err?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
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
                {images.map((img, index) => (
                  <View key={index} className="relative">
                    <Image
                      source={{ uri: img.uri }}
                      className="w-24 h-24 rounded-xl"
                      resizeMode="cover"
                    />
                    {!uploading && (
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                      >
                        <Ionicons name="close" size={14} color="white" />
                      </TouchableOpacity>
                    )}
                    {/* Upload indicator per image */}
                    {uploading && index >= uploadedPaths.length && (
                      <View className="absolute inset-0 bg-black/40 rounded-xl items-center justify-center">
                        <ActivityIndicator size="small" color="white" />
                      </View>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={pickImages}
                  disabled={uploading}
                  className={`w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 items-center justify-center ${
                    uploading ? "opacity-50" : ""
                  }`}
                >
                  <Ionicons name="camera" size={28} color="#999" />
                  <Text className="text-xs text-gray-400 mt-1">
                    {uploading ? "Uploading..." : "Add"}
                  </Text>
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

            {/* Product Name */}
            <View className="my-2">
              <Text className="text-lg font-JakartaSemiBold mb-2">
                Product Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-neutral-100 rounded-full p-4 font-JakartaSemiBold text-[15px]"
                placeholder="Enter product name"
                placeholderTextColor="#9CA3AF"
                value={input.productName}
                onChangeText={(v) => handleInput("productName", v)}
              />
            </View>

            {/* Price */}
            <View className="my-2">
              <Text className="text-lg font-JakartaSemiBold mb-2">
                Price <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-neutral-100 rounded-full p-4 font-JakartaSemiBold text-[15px]"
                placeholder="Enter price"
                placeholderTextColor="#9CA3AF"
                value={input.productPrice}
                onChangeText={(v) => handleInput("productPrice", v)}
                keyboardType="numeric"
              />
            </View>

            {/* Original Price */}
            <View className="my-2">
              <Text className="text-lg font-JakartaSemiBold mb-2">
                Original Price <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-neutral-100 rounded-full p-4 font-JakartaSemiBold text-[15px]"
                placeholder="Enter original price"
                placeholderTextColor="#9CA3AF"
                value={input.productOriginPrice}
                onChangeText={(v) => handleInput("productOriginPrice", v)}
                keyboardType="numeric"
              />
            </View>

            {/* Stock Count */}
            <View className="my-2">
              <Text className="text-lg font-JakartaSemiBold mb-2">
                Stock Count <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-neutral-100 rounded-full p-4 font-JakartaSemiBold text-[15px]"
                placeholder="How many in stock?"
                placeholderTextColor="#9CA3AF"
                value={input.productLeftCount}
                onChangeText={(v) => handleInput("productLeftCount", v)}
                keyboardType="numeric"
              />
            </View>

            {/* Origin Dropdown */}
            <View className="my-2">
              <Text className="text-lg font-JakartaSemiBold mb-2">Origin</Text>
              <View className="flex-row flex-wrap gap-2">
                {ORIGINS.map((origin) => {
                  const isSelected = input.productOrigin === origin;
                  return (
                    <TouchableOpacity
                      key={origin}
                      onPress={() =>
                        handleInput(
                          "productOrigin",
                          isSelected ? "" : origin
                        )
                      }
                      className={`px-3 py-2 rounded-full ${
                        isSelected
                          ? "bg-[#E9AB18]"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-xs font-JakartaSemiBold ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {origin}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Description */}
            <View className="my-2">
              <Text className="text-lg font-JakartaSemiBold mb-2">
                Description
              </Text>
              <TextInput
                className="bg-neutral-100 rounded-2xl p-4 font-JakartaSemiBold text-[15px] min-h-[100px]"
                placeholder="Describe your product"
                placeholderTextColor="#9CA3AF"
                value={input.productDesc}
                onChangeText={(v) => handleInput("productDesc", v)}
                multiline
                textAlignVertical="top"
              />
            </View>

            <CustomButton
              title={loading ? "" : "Create Product"}
              bgVariant="dark-green"
              className="mt-6"
              onPress={handleCreate}
              disabled={loading || uploading}
              IconLeft={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : undefined
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
