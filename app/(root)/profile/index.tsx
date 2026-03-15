import { userVar } from "@/apollo/store";
import { UPDATE_MEMBER } from "@/apollo/user/mutation";
import CustomButton from "@/components/CustomButton";
import Followers from "@/components/Followers";
import Followings from "@/components/Followings";
import InputField from "@/components/InputField";
import { images } from "@/constants";
import { getToken, saveToken, updateUserInfo } from "@/libs/auth";
import { getImageUrl, Messages, REACT_APP_API_URL } from "@/types/config";
import { MemberUpdate } from "@/types/member/member.update";
import { sweetErrorHandling, sweetMixinSuccessAlert } from "@/types/sweetAlert";
import { useMutation, useReactiveVar } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Host, Portal } from "react-native-portalize";
import { SafeAreaView } from "react-native-safe-area-context";

interface UpdateMemberResponse {
  updateMember: {
    accessToken: string;
  };
}

export default function MyPage() {
  const user = useReactiveVar(userVar);
  const imgPath = `${REACT_APP_API_URL}/${user.memberImage}`;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    "followers" | "followings" | null
  >(null);

  /** APOLLO REQUESTS **/
  const [updateMember] = useMutation<UpdateMemberResponse>(UPDATE_MEMBER);
  const [updateData, setUpdateData] = useState<MemberUpdate>({
    _id: "",
    memberImage: "",
    memberNick: "",
    memberPhone: "",
    memberAddress: "",
  });

  /** LIFECYCLES **/
  useEffect(() => {
    setUpdateData({
      ...updateData,
      memberNick: user.memberNick,
      memberPhone: user.memberPhone,
      memberAddress: user?.memberAddress,
      memberImage: user.memberImage,
    });
  }, [user]);

  const updateProfileHandler = useCallback(async () => {
    try {
      if (!user._id) throw new Error(Messages.error2);
      updateData._id = user._id;

      const result = await updateMember({
        variables: {
          input: updateData,
        },
      });

      // @ts-ignore
      const jwtToken = result.data.updateMember?.accessToken;

      if (jwtToken) {
        console.log("jwtToken", jwtToken);
        await saveToken(jwtToken);
        updateUserInfo(jwtToken);
      }
      await sweetMixinSuccessAlert("Information updated successfully!");
    } catch (err: any) {
      console.log("Error, updateProfileHandler", err);
      sweetErrorHandling(err).then();
    }
  }, [updateData]);

  const uploadImage = async (image: any) => {
    console.log("Uploading image:", image);
    try {
      const token = await getToken();

      const formData = new FormData();

      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
            imageUploader(file: $file, target: $target)
          }`,
          variables: {
            file: null,
            target: "member",
          },
        })
      );

      formData.append(
        "map",
        JSON.stringify({
          "0": ["variables.file"],
        })
      );

      formData.append("0", {
        uri: image.uri,
        name: image.fileName || "photo.jpg",
        type: image.mimeType || "image/jpeg",
      } as any);

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

      const uploadedImage = response.data.data.imageUploader;

      setUpdateData((prev) => ({
        ...prev,
        memberImage: uploadedImage,
      }));
    } catch (err) {
      console.log("Upload image error:", err);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      console.log("camera image", image);

      uploadImage(image);
    } catch (err) {
      console.log("Camera error:", err);
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      "Select Image",
      "Choose image source",
      [
        {
          text: "Camera",
          onPress: takePhoto,
        },
        {
          text: "Gallery",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert("Permission to access gallery is required!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"] as any,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      console.log("image", image);

      uploadImage(image);
    } catch (err) {
      console.log("Image picker error:", err);
    }
  };
  const modalizeRef = useRef<Modalize>(null);

  const openBottomSheet = (type: "followers" | "followings") => {
    setActiveModal(type);
    modalizeRef.current?.open();
  };
  return (
    <Host>
      <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView className="flex-1">
          <View>
            <View className="bg-gray-100 p-4">
              <View className="relative items-center">
                <Image
                  source={images.backImage}
                  className="w-full h-56 rounded-3xl"
                  resizeMode="cover"
                />
                <View className="absolute left-2 top-2">
                  <Pressable
                    onPress={() => {
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.replace("/");
                      }
                    }}
                  >
                    <Feather name="arrow-left-circle" size={44} color="white" />
                  </Pressable>
                </View>

                <View className="absolute -bottom-16 items-center">
                  <View className="bg-white p-2 rounded-full">
                    {updateData.memberImage ? (
                      <Pressable
                        onPress={() =>
                          setSelectedImage(getImageUrl(updateData.memberImage))
                        }
                      >
                        <Image
                          source={{
                            uri: `${REACT_APP_API_URL}/${updateData.memberImage}`,
                          }}
                          className="w-32 h-32 rounded-full"
                        />
                      </Pressable>
                    ) : (
                      <Image
                        source={images.defaultUser}
                        className="w-32 h-32 rounded-full"
                      />
                    )}

                    <Pressable
                      onPress={selectImageSource}
                      className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full"
                    >
                      <EvilIcons name="pencil" size={18} color="black" />
                    </Pressable>

                    <Modal
                      visible={!!selectedImage}
                      transparent
                      animationType="fade"
                    >
                      <View className="flex-1 bg-black justify-center items-center">
                        {/* Close Button */}
                        <Pressable
                          onPress={() => setSelectedImage(null)}
                          style={{
                            position: "absolute",
                            top: 60,
                            right: 20,
                            zIndex: 10,
                          }}
                        >
                          <Ionicons name="close" size={32} color="white" />
                        </Pressable>

                        {/* Fullscreen Image */}
                        {selectedImage && (
                          <Image
                            source={{ uri: selectedImage }}
                            style={{
                              width: "100%",
                              height: "80%",
                            }}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                    </Modal>
                  </View>
                </View>
              </View>

              <View className="h-20" />
            </View>
            <View className="flex justify-center items-center">
              <View className="flex flex-row justify-center items-center gap-1">
                <Text className="text-[20px] font-JakartaBold">
                  {updateData.memberNick}
                </Text>
                <MaterialIcons name="verified" size={24} color="#155FEF" />
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-[16px] text-[#155FEF] font-JakartaSemiBold">
                  Online
                </Text>
                <View className="w-[2px] h-4 bg-[#155FEF] mx-2" />
                <Text className="text-[16px] text-[#155FEF] font-JakartaSemiBold">
                  {user.memberType}
                </Text>
              </View>
            </View>
            <View>
              <View className="flex flex-row justify-center mt-5 gap-[16px]">
                <CustomButton
                  title="My Posts"
                  className="rounded-xl px-5 gap-2"
                  textStyle="font-JakartaSemiBold font-normal"
                  IconLeft={<EvilIcons name="pencil" size={24} color="white" />}
                />
                <CustomButton
                  title="My Favorites"
                  IconLeft={<AntDesign name="heart" size={24} color="red" />}
                  className="rounded-xl px-5 gap-2 bg-[#F0F8FF]"
                  textStyle="font-JakartaSemiBold font-normal"
                  textVariant="primary"
                />
              </View>
              <View className="flex flex-row justify-center mt-5 gap-[16px]">
                <CustomButton
                  title="My Followers"
                  className="rounded-xl px-5 gap-2 bg-blue-500"
                  textStyle="font-JakartaSemiBold font-normal"
                  IconLeft={<Feather name="users" size={22} color="white" />}
                  onPress={() => openBottomSheet("followers")}
                />
                <CustomButton
                  title="My Followings"
                  IconLeft={
                    <Feather name="user-plus" size={22} color="black" />
                  }
                  className="rounded-xl px-5 gap-2 bg-[#FFF0F3]"
                  textStyle="font-JakartaSemiBold font-normal"
                  textVariant="primary"
                  onPress={() => openBottomSheet("followings")}
                />
              </View>
            </View>
            <View className="p-4 mt-5">
              <View>
                <InputField
                  label="Username"
                  placeholder="Edit your name"
                  inputStyle="border-2 rounded-xl"
                  value={updateData.memberNick}
                  onChangeText={(value) =>
                    setUpdateData({ ...updateData, memberNick: value })
                  }
                />
              </View>
              <View>
                <InputField
                  label="Phone number"
                  placeholder="Edit your phone number"
                  inputStyle="border-2 rounded-xl"
                  value={updateData.memberPhone}
                  onChangeText={(value) =>
                    setUpdateData({ ...updateData, memberPhone: value })
                  }
                />
              </View>
              <View>
                <InputField
                  label="Address"
                  placeholder="Edit your address"
                  inputStyle="border-2 rounded-xl"
                  value={
                    updateData.memberAddress ? updateData.memberAddress : ""
                  }
                  onChangeText={(value) =>
                    setUpdateData({ ...updateData, memberAddress: value })
                  }
                />
              </View>

              <CustomButton
                title="Update"
                className="rounded-lg bg-black gap-2 mt-7"
                IconLeft={<MaterialIcons name="edit" size={24} color="white" />}
                onPress={updateProfileHandler}
              />
            </View>
          </View>
        </ScrollView>
        <Portal>
          <Modalize ref={modalizeRef} adjustToContentHeight snapPoint={400}>
            <View className="p-5 h-auto max-h-[700px] min-h-[300px]">
              <ScrollView>
                {activeModal === "followers" && <Followers />}

                {activeModal === "followings" && <Followings />}
              </ScrollView>
            </View>
          </Modalize>
        </Portal>
      </SafeAreaView>
    </Host>
  );
}
