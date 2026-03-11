import { UPDATE_MEMBER } from "@/apollo/user/mutation";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { images } from "@/constants";
import { useUser } from "@/hooks/useUser";
import { getToken, saveToken, updateUserInfo } from "@/libs/auth";
import { Messages, REACT_APP_API_URL } from "@/types/config";
import { MemberUpdate } from "@/types/member/member.update";
import { sweetErrorHandling, sweetMixinSuccessAlert } from "@/types/sweetAlert";
import { useMutation } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UpdateMemberResponse {
  updateMember: {
    accessToken: string;
  };
}

export default function UserPage() {
  const { userId } = useLocalSearchParams();
  console.log("userId", userId);
  const { getUserLoading, getUserData } = useUser(userId as string);
  const user = getUserData?.getMember;

  const imgPath = `${REACT_APP_API_URL}/${user?.memberImage}`;

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
      memberNick: user?.memberNick,
      memberPhone: user?.memberPhone,
      memberAddress: user?.memberAddress,
      memberImage: user?.memberImage,
    });
  }, [user]);

  const updateProfileHandler = useCallback(async () => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      updateData._id = user?._id;

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
  return (
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
                      console.log("hello");
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
                    <Image
                      source={{
                        uri: `${REACT_APP_API_URL}/${updateData.memberImage}`,
                      }}
                      className="w-32 h-32 rounded-full"
                    />
                  ) : (
                    <Image
                      source={images.defaultUser}
                      className="w-32 h-32 rounded-full"
                    />
                  )}
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
                Active
              </Text>
              <View className="w-[2px] h-4 bg-[#155FEF] mx-2" />
              <Text className="text-[16px] text-[#155FEF] font-JakartaSemiBold">
                {user?.memberType}
              </Text>
            </View>
          </View>
          <View className="flex flex-row justify-center mt-5 gap-[16px]">
            <CustomButton
              title="Message"
              className="rounded-xl px-5 gap-2"
              textStyle="font-JakartaSemiBold font-normal"
              IconLeft={
                <Feather name="message-circle" size={20} color="white" />
              }
              onPress={() => {
                if (!user?._id) return;

                router.push({
                  pathname: "/chat/[userId]",
                  params: { userId: user._id },
                });
              }}
            />

            <CustomButton
              title="Follow"
              IconLeft={<Feather name="user-plus" size={20} color="#155FEF" />}
              className="rounded-xl px-5 gap-2 bg-[#F0F8FF]"
              textStyle="font-JakartaSemiBold font-normal"
              textVariant="primary"
            />
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
                editable={false}
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
                editable={false}
              />
            </View>
            <View>
              <InputField
                label="Address"
                placeholder={`${user?.memberNick}'s address is not available`}
                inputStyle="border-2 rounded-xl"
                value={updateData.memberAddress ? updateData.memberAddress : ""}
                onChangeText={(value) =>
                  setUpdateData({ ...updateData, memberAddress: value })
                }
                editable={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
